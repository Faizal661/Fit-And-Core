// services/availability.service.ts
import { Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import { IAvailabilityRepository } from "../../repositories/Interface/IAvailabilityRepository";
import { ISlotRepository } from "../../repositories/Interface/ISlotRepository";
import { ISessionService } from "../Interface/ISessionService";
import { CreateAvailabilityParams, ISlot } from "../../types/session.types";
import { IAvailabilityModel } from "../../models/session.model/availability.models";
import { ISlotModel } from "../../models/session.model/slot.models";
import { CustomError } from "../../errors/CustomError";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { ITrainerRepository } from "../../repositories/Interface/ITrainerRepository";
import { IUserRepository } from "../../repositories/Interface/IUserRepository";
import { IBookingRepository } from "../../repositories/Interface/IBookingRepository";
import { IBookingModel } from "../../models/session.model/booking.models";
type GroupedAvailabilities = Record<string, IAvailabilityModel[]>;

@injectable()
export default class SessionService implements ISessionService {
  constructor(
    @inject("AvailabilityRepository")
    private availabilityRepository: IAvailabilityRepository,
    @inject("SlotRepository")
    private slotRepository: ISlotRepository,
    @inject("TrainerRepository")
    private trainerRepository: ITrainerRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("BookingRepository")
    private bookingRepository: IBookingRepository
  ) {}

  async createAvailability(
    params: CreateAvailabilityParams
  ): Promise<{ availability: IAvailabilityModel; slots: ISlotModel[] }> {
    try {
      const { userId, selectedDate, startTime, endTime, slotDuration } = params;

      const trainer = await this.trainerRepository.findOne({ userId });
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }
      const trainerId = trainer.id;

      const overlappingAvailability =
        await this.availabilityRepository.findOverlappingAvailability(
          new Types.ObjectId(trainerId),
          selectedDate,
          startTime,
          endTime
        );

      if (overlappingAvailability) {
        throw new CustomError(
          `${HttpResMsg.AVAILABILITY_OVERLAP_ERROR} ${startTime} to ${endTime}`,
          HttpResCode.CONFLICT
        );
      }

      const availability = await this.availabilityRepository.create({
        trainerId: new Types.ObjectId(trainerId),
        selectedDate,
        startTime,
        endTime,
        slotDuration,
      });

      const slots = this.generateSlots(availability);

      const createdSlots = await this.slotRepository.createMany(slots);

      return { availability, slots: createdSlots };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        HttpResMsg.FAILED_TO_CREATE_AVAILABILITY,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAvailabilitiesByDate(
    userId: string,
    dateString: string
  ): Promise<IAvailabilityModel[]> {
    try {
      const trainer = await this.trainerRepository.findOne({ userId });
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }
      const trainerId = trainer.id;

      const selectedDate = new Date(dateString);

      if (isNaN(selectedDate.getTime())) {
        throw new CustomError(
          HttpResMsg.INVALID_DATE_FORMAT,
          HttpResCode.BAD_REQUEST
        );
      }

      const availabilities =
        await this.availabilityRepository.findAvailabilitiesByTrainerAndDate(
          new Types.ObjectId(trainerId),
          selectedDate
        );

      return availabilities;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        HttpResMsg.FAILED_TO_CHECK_AVAILABILITY,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUpcomingAvailabilitiesGrouped(
    userId: string,
    startDateString: string
  ): Promise<GroupedAvailabilities> {
    try {
      const trainer = await this.trainerRepository.findOne({ userId });
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }
      const trainerId = trainer.id;

      const startDate = new Date(startDateString);

      if (isNaN(startDate.getTime())) {
        throw new CustomError(
          HttpResMsg.INVALID_DATE_FORMAT,
          HttpResCode.BAD_REQUEST
        );
      }

      const availabilities =
        await this.availabilityRepository.findAvailabilitiesFromDate(
          new Types.ObjectId(trainerId),
          startDate
        );

      const groupedAvailabilities: GroupedAvailabilities = {};

      availabilities.forEach((avail) => {
        const dateKey = avail.selectedDate.toISOString().split("T")[0];
        if (!groupedAvailabilities[dateKey]) {
          groupedAvailabilities[dateKey] = [];
        }
        groupedAvailabilities[dateKey].push(avail);
      });

      return groupedAvailabilities;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        HttpResMsg.FAILED_TO_GET_AVAILABILITY,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  // slots

  async getSlotsByTrainerAndDate(
    trainerId: string,
    dateString: string
  ): Promise<ISlotModel[]> {
    try {
      const selectedDate = new Date(dateString);

      if (isNaN(selectedDate.getTime())) {
        throw new CustomError(
          HttpResMsg.INVALID_DATE_FORMAT,
          HttpResCode.BAD_REQUEST
        );
      }

      let trainer = await this.trainerRepository.findOne({
        _id: new Types.ObjectId(trainerId),
      });
      if (!trainer) {
        trainer = await this.trainerRepository.findOne({
          userId: new Types.ObjectId(trainerId),
        });
        if (trainer) trainerId = trainer.id;
      }
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }

      const availabilitiesForDate: IAvailabilityModel[] =
        await this.availabilityRepository.findAvailabilitiesByTrainerAndDate(
          new Types.ObjectId(trainerId),
          selectedDate
        );

      const availabilityIds = availabilitiesForDate.map((avail) => avail._id);

      const slots = await this.slotRepository.findSlotsByAvailabilityIds(
        availabilityIds
      );

      return slots;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        HttpResMsg.FAILED_TO_GET_SLOTS,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async bookSlot(slotId: string, userId: string): Promise<ISlotModel | null> {
    try {
      const slot = await this.slotRepository.findById(
        new Types.ObjectId(slotId)
      );

      if (!slot) {
        throw new CustomError(HttpResMsg.SLOT_NOT_FOUND, HttpResCode.NOT_FOUND);
      }

      if (slot.status !== "available") {
        throw new CustomError(
          HttpResMsg.SLOT_UNAVAILABLE,
          HttpResCode.BAD_REQUEST
        );
      }
      const userExists = await this.userRepository.findById(
        new Types.ObjectId(userId)
      );

      if (!userExists) {
        throw new CustomError(HttpResMsg.USER_NOT_FOUND, HttpResCode.NOT_FOUND);
      }

      const newBooking = await this.bookingRepository.create({
        slotId: slot.id,
        trainerId: slot.trainerId,
        userId: new Types.ObjectId(userId),
      });

      slot.status = "booked";
      slot.bookingId = newBooking._id;

      const updatedSlot = await this.slotRepository.update(
        new Types.ObjectId(slotId),
        slot
      );

      return updatedSlot;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        HttpResMsg.FAILED_TO_BOOK_SLOT,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async cancelAvailableSlot(
    slotIdString: string,
    userId: string
  ): Promise<ISlotModel | null> {
    try {
      let slotId: Types.ObjectId;
      try {
        slotId = new Types.ObjectId(slotIdString);
      } catch (error) {
        throw new CustomError(
          HttpResMsg.INVALID_SLOT_ID_FORMAT,
          HttpResCode.BAD_REQUEST
        );
      }

      const trainer = await this.trainerRepository.findOne({ userId: userId });
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.FORBIDDEN
        );
      }
      const trainerId = trainer._id;

      const canceledSlot = await this.slotRepository.cancelAvailableSlot(
        slotId,
        trainerId as Types.ObjectId
      );

      if (!canceledSlot) {
        const slotAfterAttempt = await this.slotRepository.findById(slotId);

        if (!slotAfterAttempt) {
          throw new CustomError(
            HttpResMsg.SLOT_NOT_FOUND,
            HttpResCode.NOT_FOUND
          );
        } else if (
          !slotAfterAttempt.trainerId.equals(trainerId as Types.ObjectId)
        ) {
          throw new CustomError(
            HttpResMsg.NO_PERMISSION_TO_CANCEL_SLOT,
            HttpResCode.FORBIDDEN
          );
        } else {
          throw new CustomError(
            `${HttpResMsg.SLOT_CURRENT_STATUS} ${slotAfterAttempt.status}`,
            HttpResCode.CONFLICT
          );
        }
      }

      return canceledSlot;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        HttpResMsg.FAILED_TO_CANCEL_SLOT,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  // bookings

  async getUpcomingTrainerBookings(userId: string): Promise<IBookingModel[]> {
    try {
      const trainer = await this.trainerRepository.findOne({ userId: userId });
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.FORBIDDEN
        );
      }
      const trainerId = trainer._id;

      const currentDate = new Date();

      const upcomingBookings =
        await this.bookingRepository.findUpcomingBookingsByTrainer(
          trainerId as Types.ObjectId,
          currentDate
        );

      return upcomingBookings;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to fetch upcoming trainer bookings.",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async trainerancelBooking(
    bookingIdString: string,
    reason: string,
    userId: string
  ): Promise<IBookingModel | null> {
    try {
      let bookingId: Types.ObjectId;
      try {
        bookingId = new Types.ObjectId(bookingIdString);
      } catch (error) {
        throw new CustomError(
          "Invalid booking ID format.",
          HttpResCode.BAD_REQUEST
        );
      }

      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking) {
        throw new CustomError(
          HttpResMsg.BOOKING_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }

      const trainer = await this.trainerRepository.findOne({ userId: userId });
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.FORBIDDEN
        );
      }
      const trainerId = trainer._id as Types.ObjectId;

      if (!booking.trainerId.equals(trainerId)) {
        throw new CustomError(
          HttpResMsg.NO_PERMISSION_TO_CANCEL_BOOKING,
          HttpResCode.FORBIDDEN
        );
      }

      if (booking.status === "canceled" || booking.status === "completed") {
        throw new CustomError(
          `Booking is already ${booking.status}.`,
          HttpResCode.CONFLICT
        );
      }

      reason = `Trainer Cancellation Reason : ${reason}`;

      const updatedBooking = await this.bookingRepository.update(bookingId, {
        status: "canceled",
        notes: reason,
      });

      return updatedBooking;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        HttpResMsg.FAILED_TO_CANCEL_BOOKING,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllUserBookingsWithTrainer(
    userIdString: string,
    trainerIdString: string
  ): Promise<any[]> {
    try {
      let userId: Types.ObjectId;
      try {
        userId = new Types.ObjectId(userIdString);
      } catch (error) {
        throw new CustomError(
          "Invalid user ID format.",
          HttpResCode.UNAUTHORIZED
        );
      }

      let trainerId: Types.ObjectId;
      try {
        trainerId = new Types.ObjectId(trainerIdString);
      } catch (error) {
        throw new CustomError(
          "Invalid trainer ID format.",
          HttpResCode.BAD_REQUEST
        );
      }

      const trainerExists = await this.trainerRepository.findById(trainerId);
      if (!trainerExists) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }

      const allUserBookings =
        await this.bookingRepository.findAllBookingsByUserAndTrainer(
          userId,
          trainerId
        );

      return allUserBookings;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to fetch user bookings.",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async userCancelBooking(
    bookingIdString: string,
    reason: string,
    userId: string
  ): Promise<IBookingModel | null> {
    try {
      let bookingId: Types.ObjectId;
      try {
        bookingId = new Types.ObjectId(bookingIdString);
      } catch (error) {
        throw new CustomError(
          "Invalid booking ID format.",
          HttpResCode.BAD_REQUEST
        );
      }

      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking) {
        throw new CustomError(
          HttpResMsg.BOOKING_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }

      if (!booking.userId.equals(userId)) {
        throw new CustomError(
          HttpResMsg.NO_PERMISSION_TO_CANCEL_BOOKING,
          HttpResCode.FORBIDDEN
        );
      }

      if (booking.status === "canceled" || booking.status === "completed") {
        throw new CustomError(
          `Booking is already ${booking.status}.`,
          HttpResCode.CONFLICT
        );
      }

      reason = `Trainee Cancellation Reason :  ${reason}`;

      const updatedBooking = await this.bookingRepository.update(bookingId, {
        status: "canceled",
        notes: reason,
      });

      await this.slotRepository.update(booking.slotId, { status: "available" });

      return updatedBooking;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        HttpResMsg.FAILED_TO_CANCEL_BOOKING,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  // - ------------------

  private generateSlots(
    availability: IAvailabilityModel
  ): Partial<ISlotModel>[] {
    const { _id, trainerId, selectedDate, startTime, endTime, slotDuration } =
      availability;
    const slots: Partial<ISlotModel>[] = [];

    // Convert time strings to minutes '10:00' => 600 & '10:30' =>630
    const startMinutes = this.convertTimeToMinutes(startTime);
    const endMinutes = this.convertTimeToMinutes(endTime);

    // Generate slots
    for (
      let currentMinute = startMinutes;
      currentMinute < endMinutes;
      currentMinute += slotDuration
    ) {
      const slotStartTime = this.convertMinutesToTime(currentMinute);
      const slotEndTime = this.convertMinutesToTime(
        currentMinute + slotDuration
      );

      if (currentMinute + slotDuration > endMinutes) return slots;

      slots.push({
        availabilityId: _id,
        trainerId,
        slotDate: selectedDate,
        startTime: slotStartTime,
        endTime: slotEndTime,
        status: "available",
      });
    }

    return slots;
  }

  private convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  private convertMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }
}
