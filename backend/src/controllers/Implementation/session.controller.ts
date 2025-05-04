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
import { Types } from "mongoose";

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

      sendResponse(res, HttpResCode.CREATED, HttpResMsg.SUCCESS, result);
    } catch (error) {
      next(error);
    }
  }

  async getTrainerAvailabilityByDate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dateString = req.query.date as string;
      const userId = req.decoded?.id!;

      if (!dateString) {
        throw new CustomError(
          HttpResMsg.DATE_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      const availabilities = await this.sessionService.getAvailabilitiesByDate(
        userId,
        dateString
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { availabilities });
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingTrainerAvailabilities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const startDateString = req.query.startDate as string | undefined;
      const userId = req.decoded?.id;
      if (!userId) {
        throw new CustomError(
          HttpResMsg.UNAUTHORIZED,
          HttpResCode.UNAUTHORIZED
        );
      }

      let dateToFetch: string;
      if (startDateString) {
        const date = new Date(startDateString);
        if (isNaN(date.getTime())) {
          throw new CustomError(
            HttpResMsg.INVALID_DATE_FORMAT,
            HttpResCode.BAD_REQUEST
          );
        }
        dateToFetch = startDateString;
      } else {
        dateToFetch = new Date().toISOString().split("T")[0];
      }

      const groupedAvailabilities =
        await this.sessionService.getUpcomingAvailabilitiesGrouped(
          userId,
          dateToFetch
        );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        groupedAvailabilities,
      });
    } catch (error) {
      next(error);
    }
  }

  // --------- slots

  async getTrainerSlotsByDate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.query.trainerId as string;
      const date = req.query.date as string;

      if (!trainerId) {
        throw new CustomError(
          HttpResMsg.TRAINER_ID_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      if (!date) {
        throw new CustomError(
          HttpResMsg.DATE_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      const slots = await this.sessionService.getSlotsByTrainerAndDate(
        trainerId,
        date
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { slots });
    } catch (error) {
      next(error);
    }
  }

  async bookSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slotId } = req.body;
      const userId = req.decoded?.id!;

      if (!slotId) {
        throw new CustomError(
          HttpResMsg.SLOT_ID_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      if (!Types.ObjectId.isValid(slotId)) {
        throw new CustomError(
          HttpResMsg.INVALID_SLOT_ID_FORMAT,
          HttpResCode.BAD_REQUEST
        );
      }

      const bookedSlot = await this.sessionService.bookSlot(slotId, userId);

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        slot: bookedSlot,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelAvailableSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slotId } = req.body;
      const userId = req.decoded?.id;

      if (!userId) {
        throw new CustomError(
          HttpResMsg.UNAUTHORIZED,
          HttpResCode.UNAUTHORIZED
        );
      }
      if (!slotId) {
        throw new CustomError(HttpResMsg.SLOT_ID_REQUIRED, HttpResCode.BAD_REQUEST);
      }

      const canceledSlot = await this.sessionService.cancelAvailableSlot(
        slotId,
        userId
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, canceledSlot);
    } catch (error) {
      next(error);
    }
  }

  // -------- bookings
  async getUpcomingTrainerBookings(
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

      const upcomingBookings =
        await this.sessionService.getUpcomingTrainerBookings(userId);

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        upcomingBookings,
      });
    } catch (error) {
      next(error);
    }
  }

  async trainerCancelBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId, reason } = req.body;
      const userId = req.decoded?.id;

      if (!userId) {
        throw new CustomError(
          HttpResMsg.UNAUTHORIZED,
          HttpResCode.UNAUTHORIZED
        );
      }
      if (!bookingId) {
        throw new CustomError(
          HttpResMsg.BOOKING_ID_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      if (!reason) {
        throw new CustomError(
          HttpResMsg.CANCELLATION_REASON_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      const updatedBooking = await this.sessionService.trainerancelBooking(
        bookingId,
        reason,
        userId
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, updatedBooking);
    } catch (error) {
      next(error);
    }
  }

  async getAllUserBookingsWithTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.query.trainerId as string;
      const userId = req.decoded?.id;

      if (!userId) {
        throw new CustomError(
          HttpResMsg.UNAUTHORIZED,
          HttpResCode.UNAUTHORIZED
        );
      }
      if (!trainerId) {
        throw new CustomError(
          HttpResMsg.TRAINER_ID_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      const allUserBookings =
        await this.sessionService.getAllUserBookingsWithTrainer(
          userId,
          trainerId
        );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        data: allUserBookings,
      });
    } catch (error) {
      next(error);
    }
  }

  async userCancelBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId, reason } = req.body;
      const userId = req.decoded?.id;

      if (!userId) {
        throw new CustomError(
          HttpResMsg.UNAUTHORIZED,
          HttpResCode.UNAUTHORIZED
        );
      }
      if (!bookingId) {
        throw new CustomError(
          HttpResMsg.BOOKING_ID_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      
      if (!reason) {
        throw new CustomError(
          HttpResMsg.CANCELLATION_REASON_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      const updatedBooking = await this.sessionService.userCancelBooking(
        bookingId,
        reason,
        userId
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, updatedBooking);
    } catch (error) {
      next(error);
    }
  }


}
