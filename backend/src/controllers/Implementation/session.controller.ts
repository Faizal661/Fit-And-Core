import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import {
    HttpResCode,
    HttpResMsg,
} from "../../constants/http-response.constants";
import { sendResponse } from "../../utils/send-response";
import { CustomError } from "../../errors/CustomError";
import { ISessionController } from "../Interface/ISessionController";
import { ISessionService } from "../../services/Interface/ISessionService";

@injectable()
export class SessionController implements ISessionController {
  constructor(
    @inject("SessionService")
    private sessionService: ISessionService
  ) {
    this.sessionService = sessionService;
  }

  async createAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { selectedDate, startTime, endTime, slotDuration } = req.body;
      const userId = req.decoded?.id;

      if (!userId || !selectedDate || !startTime || !endTime || !slotDuration) {
        throw new CustomError(HttpResMsg.BAD_REQUEST, HttpResCode.BAD_REQUEST);
      }

      const result = await this.sessionService.createAvailability({
        userId,
        selectedDate: new Date(selectedDate),
        startTime,
        endTime,
        slotDuration,
      });

      sendResponse(
        res,
        HttpResCode.CREATED,
        HttpResMsg.SUCCESS,
        result
      );
    } catch (error) {
      next(error);
    }
  }

  async getTrainerAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.params.trainerId || req.decoded?.id;

      if (!trainerId) {
        throw new CustomError(HttpResMsg.BAD_REQUEST, HttpResCode.BAD_REQUEST);
      }

      const availabilities = await this.sessionService.getTrainerAvailability(trainerId);

      sendResponse(
        res,
        HttpResCode.OK,
        HttpResMsg.SUCCESS,
        availabilities
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { availabilityId } = req.params;
      const trainerId = req.decoded?.id;

      if (!availabilityId || !trainerId) {
        throw new CustomError(HttpResMsg.BAD_REQUEST, HttpResCode.BAD_REQUEST);
      }

      const result = await this.sessionService.deleteAvailability(availabilityId);

      if (!result) {
        throw new CustomError(HttpResMsg.NOT_FOUND, HttpResCode.NOT_FOUND);
      }

      sendResponse(
        res,
        HttpResCode.OK,
        HttpResMsg.SUCCESS,
        { message: "Availability deleted successfully" }
      );
    } catch (error) {
      next(error);
    }
  }
}