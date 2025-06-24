import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { sendResponse } from "../../utils/send-response";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import CustomError from "../../errors/CustomError";
import { IProgressService } from "../../services/Interface/IProgressService";
import { IProgressController } from "../Interface/IProgressController";
import { Types } from "mongoose";

@injectable()
export class ProgressController implements IProgressController {
  private progressService: IProgressService;

  constructor(
    @inject("ProgressService")
    progressService: IProgressService
  ) {
    this.progressService = progressService;
  }

  async getMyProgressions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { traineeId } = req.params;
      const progressions = await this.progressService.getTraineeProgressions(
        new Types.ObjectId(traineeId)
      );
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { progressions });
    } catch (error) {
      next(error);
    }
  }

  async addNewProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;
      if (!userId) {
        throw new CustomError(
          HttpResMsg.UNAUTHORIZED,
          HttpResCode.UNAUTHORIZED
        );
      }

      const { height, weight } = req.body;
      const newProgression = await this.progressService.addNewProgress(
        new Types.ObjectId(userId) ,
        height,
        weight
      );
      sendResponse(
        res,
        HttpResCode.CREATED,
        HttpResMsg.CREATED,
        newProgression
      );
    } catch (error) {
      next(error);
    }
  }
}
