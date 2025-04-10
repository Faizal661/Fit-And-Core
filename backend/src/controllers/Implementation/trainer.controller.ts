import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpResCode, HttpResMsg } from "../../constants/response.constants";
import { ITrainerController } from "../Interface/ITrainerController";
import { ITrainerService } from "../../services/Interface/ITrainerService";
import { sendResponse } from "../../utils/send-response";
import { uploadToCloudinary } from "../../utils/s3-upload";
import { CustomRequest } from "../../types/trainer.types";
import { CustomError } from "../../errors/CustomError";

@injectable()
export default class TrainerController implements ITrainerController {
  private trainerService: ITrainerService;

  constructor(
    @inject("TrainerService")
    trainerService: ITrainerService
  ) {
    this.trainerService = trainerService;
  }

  async applyTrainer(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;
      if (!userId) {
        sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
        return;
      }

      const { phone, specialization, yearsOfExperience, about } = req.body;

      const documentProofs: string[] = [];
      const certifications: string[] = [];
      const achievements: string[] = [];

      // Process document proofs
      if (req.files && Array.isArray(req.files.documentProofs)) {
        for (const file of req.files.documentProofs) {
          const uploadResult = await uploadToCloudinary(
            file,
            "document-proofs"
          );
          documentProofs.push(uploadResult.Location);
        }
      }

      // Process certifications
      if (req.files && Array.isArray(req.files.certifications)) {
        for (const file of req.files.certifications) {
          const uploadResult = await uploadToCloudinary(file, "certifications");
          certifications.push(uploadResult.Location);
        }
      }

      // Process achievements
      if (req.files && Array.isArray(req.files.achievements)) {
        for (const file of req.files.achievements) {
          const uploadResult = await uploadToCloudinary(file, "achievements");
          achievements.push(uploadResult.Location);
        }
      }

      if (documentProofs.length === 0) {
        sendResponse(
          res,
          HttpResCode.BAD_REQUEST,
          "At least one document proof is required"
        );
        return;
      }

      if (certifications.length === 0) {
        sendResponse(
          res,
          HttpResCode.BAD_REQUEST,
          "At least one certification is required"
        );
        return;
      }

      if (achievements.length === 0) {
        sendResponse(
          res,
          HttpResCode.BAD_REQUEST,
          "At least one achievement is required"
        );
        return;
      }

      const trainerData = {
        userId,
        phone,
        specialization,
        yearsOfExperience,
        about,
        documentProofs,
        certifications,
        achievements,
      };

      const result = await this.trainerService.applyTrainer(trainerData);

      sendResponse(
        res,
        HttpResCode.CREATED,
        "Trainer application submitted successfully",
        result
      );
    } catch (error) {
      next(error);
    }
  }

  async getApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;
      if (!userId) {
        sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
        return;
      }

      const status = await this.trainerService.getApplicationStatus(userId);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, status);
    } catch (error) {
      next(error);
    }
  }

  async approveTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { trainerId } = req.params;

      const result = await this.trainerService.approveTrainer(trainerId);

      sendResponse(
        res,
        HttpResCode.OK,
        "Trainer application approved successfully",
        result
      );
    } catch (error) {
      next(error);
    }
  }

  async rejectTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { trainerId } = req.params;
      const { reason } = req.body;

      if (!reason || typeof reason !== "string") {
        throw new CustomError(
          "Rejection reason is required",
          HttpResCode.BAD_REQUEST
        );
      }

      const result = await this.trainerService.rejectTrainer(trainerId, reason);

      sendResponse(
        res,
        HttpResCode.OK,
        "Trainer application rejected successfully",
        {result}
      );
    } catch (error) {
      next(error);
    }
  }

  async getTrainerApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const isApproved =
        req.query.approved === "true"
          ? true
          : req.query.approved === "false"
          ? false
          : undefined;

      const applications = await this.trainerService.getTrainerApplications(
        isApproved
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { applications });
    } catch (error) {
      next(error);
    }
  }
}
