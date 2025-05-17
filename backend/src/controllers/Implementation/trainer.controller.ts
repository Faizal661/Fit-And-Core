import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
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
          HttpResMsg.DOCUMENT_PROOF_REQUIRED
        );
        return;
      }

      if (certifications.length === 0) {
        sendResponse(
          res,
          HttpResCode.BAD_REQUEST,
          HttpResMsg.CERTIFICATION_REQUIRED
        );
        return;
      }

      if (achievements.length === 0) {
        sendResponse(
          res,
          HttpResCode.BAD_REQUEST,
          HttpResMsg.ACHIEVEMENT_REQUIRED
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
        HttpResMsg.TRAINER_APPLICATION_SUBMITTED,
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
        HttpResMsg.TRAINER_APPLICATION_APPROVED,
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
          HttpResMsg.REJECTION_REASON_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      const result = await this.trainerService.rejectTrainer(trainerId, reason);

      sendResponse(
        res,
        HttpResCode.OK,
        HttpResMsg.TRAINER_APPLICATION_REJECTED,
        { result }
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

  async getApprovedTrainers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const approvedTrainers = await this.trainerService.getApprovedTrainers();

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        approvedTrainers,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOneTrainerDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { trainerId } = req.params;
    try {
      const trainerData = await this.trainerService.getOneTrainerDetails(
        trainerId
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { trainerData });
    } catch (error) {
      next(error);
    }
  }

  async subscribedTrainersDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        sendResponse(res, HttpResCode.BAD_REQUEST, HttpResMsg.BAD_REQUEST);
        return;
      }
      const subscribedTrainers = await this.trainerService.getSubscribedTrainersDetails(userId);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { subscribedTrainers });
    } catch (error) {
      next(error);
    }
  }

  async getMyTrainees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const userId = req.decoded?.id;
      if (!userId) {
        sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
        return;
      }

      const { page = "1", limit = "10", search = "" } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        throw new CustomError("Invalid pagination parameters", HttpResCode.BAD_REQUEST);
      }

      const result = await this.trainerService.getMyTrainees(pageNum, limitNum, search as string , userId);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, result);
    } catch (error) {
      next(error);
    }
  }

  async getTraineeDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const trainerUserId =req.decoded?.id
      
      if (!trainerUserId) {
        sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
        return;
      }

      const {traineeId} = req.params;
      if (!traineeId) {
        sendResponse(res, HttpResCode.BAD_REQUEST, HttpResMsg.BAD_REQUEST);
        return;
      }

      const result = await this.trainerService.getTraineeDetails(traineeId,trainerUserId);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {result});
    } catch (error) {
      next(error);
    }
  }

}
