import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import BookingModel, {
  IBookingModel,
} from "../../models/session.model/booking.models";
import { IBookingRepository } from "../Interface/IBookingRepository";
import { Types } from "mongoose";

@injectable()
export class BookingRepository
  extends BaseRepository<IBookingModel>
  implements IBookingRepository
{
  constructor() {
    super(BookingModel);
  }

  async findUpcomingBookingsByTrainer(
    trainerId: Types.ObjectId,
    currentDate: Date
  ): Promise<IBookingModel[]> {
    return this.model
      .aggregate([
        {
          $match: {
            trainerId: trainerId,
            status: { $ne: "completed" },
          },
        },
        {
          $lookup: {
            from: "slots",
            localField: "slotId",
            foreignField: "_id",
            as: "slotDetails",
          },
        },
        {
          $unwind: { path: "$slotDetails", preserveNullAndEmptyArrays: false },
        },
        {
          $lookup: {
            from: "trainers",
            localField: "trainerId",
            foreignField: "_id",
            as: "trainerDetails",
          },
        },
        {
          $unwind: {
            path: "$trainerDetails",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "availabilities",
            localField: "slotDetails.availabilityId",
            foreignField: "_id",
            as: "availabilityDetails",
          },
        },
        {
          $unwind: {
            path: "$availabilityDetails",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: false },
        },
        {
          $match: {
            "availabilityDetails.selectedDate": { $gte: currentDate },
          },
        },
        {
          $sort: {
            "availabilityDetails.selectedDate": 1,
            "slotDetails.startTime": 1,
          },
        },
        {
          $project: {
            _id: 1,
            status: 1,
            notes: 1,
            createdAt: 1,
            slotDetails: {
              _id: "$slotDetails._id",
              startTime: "$slotDetails.startTime",
              endTime: "$slotDetails.endTime",
              slotDuration: "$slotDetails.slotDuration",
            },
            trainee: {
              _id: "$userDetails._id",
              username: "$userDetails.username",
              profilePicture: "$userDetails.profilePicture",
            },
            trainer: {
              _id: "$trainerDetails._id",
              username: "$trainerDetails.username",
              profilePicture: "$trainerDetails.profilePicture",
            },
            slotStart: {
              $dateFromParts: {
                year: { $year: "$availabilityDetails.selectedDate" },
                month: { $month: "$availabilityDetails.selectedDate" },
                day: { $dayOfMonth: "$availabilityDetails.selectedDate" },
                hour: {
                  $toInt: {
                    $arrayElemAt: [
                      { $split: ["$slotDetails.startTime", ":"] },
                      0,
                    ],
                  },
                },
                minute: {
                  $toInt: {
                    $arrayElemAt: [
                      { $split: ["$slotDetails.startTime", ":"] },
                      1,
                    ],
                  },
                },
              },
            },
          },
        },
      ])
      .exec();
  }

  async findAllBookingsByUserAndTrainer(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId
  ): Promise<any[]> {
    return this.model
      .aggregate([
        {
          $match: {
            userId: userId,
            trainerId: trainerId,
          },
        },
        {
          $lookup: {
            from: "slots",
            localField: "slotId",
            foreignField: "_id",
            as: "slotDetails",
          },
        },
        {
          $unwind: { path: "$slotDetails", preserveNullAndEmptyArrays: false },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: false },
        },
        {
          $lookup: {
            from: "trainers",
            localField: "trainerId",
            foreignField: "_id",
            as: "trainerDetails",
          },
        },
        {
          $unwind: {
            path: "$trainerDetails",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "availabilities",
            localField: "slotDetails.availabilityId",
            foreignField: "_id",
            as: "availabilityDetails",
          },
        },
        {
          $unwind: {
            path: "$availabilityDetails",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $sort: {
            "availabilityDetails.selectedDate": 1,
            "slotDetails.startTime": 1,
          },
        },
        {
          $project: {
            _id: 1,
            status: 1,
            notes: 1,
            createdAt: 1,
            slotDetails: {
              _id: "$slotDetails._id",
              startTime: "$slotDetails.startTime",
              endTime: "$slotDetails.endTime",
              slotDuration: "$slotDetails.slotDuration",
            },
            trainee: {
              _id: "$userDetails._id",
              username: "$userDetails.username",
              profilePicture: "$userDetails.profilePicture",
            },
            trainer: {
              _id: "$trainerDetails._id",
              username: "$trainerDetails.username",
              profilePicture: "$trainerDetails.profilePicture",
            },
            slotStart: {
              $dateFromParts: {
                year: { $year: "$availabilityDetails.selectedDate" },
                month: { $month: "$availabilityDetails.selectedDate" },
                day: { $dayOfMonth: "$availabilityDetails.selectedDate" },
                hour: {
                  $toInt: {
                    $arrayElemAt: [
                      { $split: ["$slotDetails.startTime", ":"] },
                      0,
                    ],
                  },
                },
                minute: {
                  $toInt: {
                    $arrayElemAt: [
                      { $split: ["$slotDetails.startTime", ":"] },
                      1,
                    ],
                  },
                },
              },
            },
            // selectedDate: "$availabilityDetails.selectedDate",
          },
        },
      ])
      .exec();
  }
}
