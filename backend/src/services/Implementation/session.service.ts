// services/availability.service.ts
import { Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import { IAvailabilityRepository } from "../../repositories/Interface/IAvailabilityRepository";
import { ISlotRepository } from "../../repositories/Interface/ISlotRepository";
import { ISessionService } from "../Interface/ISessionService";
import { CreateAvailabilityParams } from "../../types/session.types";
import { IAvailabilityModel } from "../../models/session.model/availability.models";
import { ISlotModel } from "../../models/session.model/slot.models";
import { CustomError } from "../../errors/CustomError";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { ITrainerRepository } from "../../repositories/Interface/ITrainerRepository";
type GroupedAvailabilities = Record<string, IAvailabilityModel[]>;

@injectable()
export default class SessionService implements ISessionService {
  constructor(
    @inject("AvailabilityRepository")
    private availabilityRepository: IAvailabilityRepository,
    @inject("SlotRepository")
    private slotRepository: ISlotRepository,
    @inject("TrainerRepository")
    private trainerRepository: ITrainerRepository
  ) {
    this.availabilityRepository = availabilityRepository;
    this.slotRepository = slotRepository;
    this.trainerRepository = trainerRepository;
  }

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
        throw new CustomError("Invalid date format.", HttpResCode.BAD_REQUEST);
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
          "Invalid start date format.",
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

  // async getTrainerAvailability(
  //   trainerId: string
  // ): Promise<IAvailabilityModel[]> {
  //   try {
  //     return this.availabilityRepository
  //       .find({
  //         trainerId: new Types.ObjectId(trainerId),
  //       })
  //       .exec();
  //   } catch (error) {
  //     throw new CustomError(
  //       HttpResMsg.FAILED_TO_GET_AVAILABILITY,
  //       HttpResCode.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // async deleteAvailability(availabilityId: string): Promise<boolean> {
  //   try {
  //     // Delete the availability
  //     const deletedAvailability = await this.availabilityRepository.delete(
  //       new Types.ObjectId(availabilityId)
  //     );

  //     if (!deletedAvailability) {
  //       return false;
  //     }

  //     // Delete all associated slots
  //     await this.slotRepository.deleteOne({
  //       availabilityId: new Types.ObjectId(availabilityId),
  //     });

  //     return true;
  //   } catch (error) {
  //     throw new CustomError(
  //       HttpResMsg.FAILED_TO_DELETE_AVAILABILITY,
  //       HttpResCode.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  private generateSlots(
    availability: IAvailabilityModel
  ): Partial<ISlotModel>[] {
    const { _id, trainerId, startTime, endTime, slotDuration } = availability;
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
