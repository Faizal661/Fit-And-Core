import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpResCode, HttpResMsg } from "../../constants/Response.constants";
import { ITrainerController } from "../Interface/ITrainerController";
import { ITrainerService } from "../../services/Interface/ITrainerService";
import { SendResponse } from "mern.common";
import { uploadToS3 } from "../../utils/s3-upload";
import { CustomRequest } from "../../types/trainer.types";

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
        return SendResponse(
          res,
          HttpResCode.UNAUTHORIZED,
          HttpResMsg.UNAUTHORIZED
        );
      }

      const { phone, specialization, yearsOfExperience, about } = req.body;

      const documentProofs: string[] = [];
      const certifications: string[] = [];
      const achievements: string[] = [];

      // Process document proofs
      if (req.files && Array.isArray(req.files.documentProofs)) {
        for (const file of req.files.documentProofs) {
          const uploadResult = await uploadToS3(file, "document-proofs");
          documentProofs.push(uploadResult.Location);
        }
      }

      // Process certifications
      if (req.files && Array.isArray(req.files.certifications)) {
        for (const file of req.files.certifications) {
          const uploadResult = await uploadToS3(file, "certifications");
          certifications.push(uploadResult.Location);
        }
      }

      // Process achievements
      if (req.files && Array.isArray(req.files.achievements)) {
        for (const file of req.files.achievements) {
          const uploadResult = await uploadToS3(file, "achievements");
          achievements.push(uploadResult.Location);
        }
      }

      // Validate required uploads
      if (documentProofs.length === 0) {
        return SendResponse(
          res,
          HttpResCode.BAD_REQUEST,
          "At least one document proof is required"
        );
      }

      if (certifications.length === 0) {
        return SendResponse(
          res,
          HttpResCode.BAD_REQUEST,
          "At least one certification is required"
        );
      }

      if (achievements.length === 0) {
        return SendResponse(
          res,
          HttpResCode.BAD_REQUEST,
          "At least one achievement is required"
        );
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

      SendResponse(
        res,
        HttpResCode.CREATED,
        "Trainer application submitted successfully",
        result
      );
    } catch (error) {
      next(error);
    }
  }

  //   async approveTrainer(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> {
  //     try {
  //       const { trainerId } = req.params;

  //       // if (req.decoded?.role !== 'admin') {
  //       //   return SendResponse(
  //       //     res,
  //       //     HttpResCode.FORBIDDEN,
  //       //     "Only admins can approve trainers"
  //       //   );
  //       // }

  //       const result = await this.trainerService.approveTrainer(trainerId);

  //       SendResponse(
  //         res,
  //         HttpResCode.OK,
  //         "Trainer application approved successfully",
  //         result
  //       );
  //     } catch (error) {
  //       next(error);
  //     }
  //   }

  //   async getTrainerApplications(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> {
  //     try {
  //       // Filter by approval status if provided
  //       const isApproved =
  //         req.query.approved === "true"
  //           ? true
  //           : req.query.approved === "false"
  //           ? false
  //           : undefined;

  //       const applications = await this.trainerService.getTrainerApplications(
  //         isApproved
  //       );

  //       SendResponse(
  //         res,
  //         HttpResCode.OK,
  //         HttpResMsg.SUCCESS,
  //         applications
  //       );
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}
