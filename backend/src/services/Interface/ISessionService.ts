import { Types } from "mongoose";
import { CreateAvailabilityParams, ISlot } from "../../types/session.types";
import { IAvailabilityModel } from "../../models/session.model/availability.models";
import { ISlotModel } from "../../models/session.model/slot.models";
import { IBookingModel } from "../../models/session.model/booking.models";

type GroupedAvailabilities = Record<string, IAvailabilityModel[]>;

export interface ISessionService {
  createAvailability(params: CreateAvailabilityParams): Promise<{
    availability: IAvailabilityModel;
    slots: ISlotModel[];
  }>;
  getAvailabilitiesByDate(
    userId: string,
    dateString: string
  ): Promise<IAvailabilityModel[]>;
  getUpcomingAvailabilitiesGrouped(
    userId: string,
    startDateString: string
  ): Promise<GroupedAvailabilities>;

  // slots
  getSlotsByTrainerAndDate(
    trainerId: string,
    dateString: string
  ): Promise<ISlotModel[]>;
  bookSlot(slotId: string, userId: string): Promise<ISlotModel | null>;
  cancelAvailableSlot(
    slotIdString: string,
    userId: string
  ): Promise<ISlotModel | null>;

  //bookings
  getUpcomingTrainerBookings(userId: string): Promise<IBookingModel[]>;
  trainerancelBooking(
    bookingIdString: string,
    reason: string,
    userId: string
  ): Promise<IBookingModel | null>;
  getAllUserBookingsWithTrainer(
    userIdString: string,
    trainerIdString: string
  ): Promise<IBookingModel[]>;
  userCancelBooking(
    bookingIdString: string,
    reason: string,
    userId: string
  ): Promise<IBookingModel | null>;

  // deleteAvailability(availabilityId: string): Promise<boolean>;
  // getTrainerAvailability(trainerId: string): Promise<IAvailabilityModel[]>;
}
