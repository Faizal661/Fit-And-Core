import { inject, injectable } from "tsyringe";
import { FilterQuery, Types } from "mongoose";
import { ITrainerService } from "../Interface/ITrainerService";
import { ITrainerRepository } from "../../repositories/Interface/ITrainerRepository";
import { IUserRepository } from "../../repositories/Interface/IUserRepository";
import { ISubscriptionRepository } from "../../repositories/Interface/ISubscriptionRepository";
import {
  trainersWithRatings,
  TrainerApplicationData,
  SubscribedTrainerWithExpiry,
  GetApprovedTrainersResponse,
} from "../../types/trainer.types";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import CustomError from "../../errors/CustomError";
import { ITrainerModel } from "../../models/trainer.models";
import {
  PaginatedTraineesResult,
  TraineeData,
} from "../../types/trainee.types";
import { IUserModel } from "../../models/user.models";
import { IReviewRepository } from "../../repositories/Interface/IReviewRepository";

@injectable()
export default class TrainerService implements ITrainerService {
  private trainerRepository: ITrainerRepository;
  private userRepository: IUserRepository;
  private subscriptionRepository: ISubscriptionRepository;

  constructor(
    @inject("TrainerRepository")
    trainerRepository: ITrainerRepository,
    @inject("UserRepository")
    userRepository: IUserRepository,
    @inject("SubscriptionRepository")
    subscriptionRepository: ISubscriptionRepository,
    @inject("ReviewRepository") private reviewRepository: IReviewRepository
  ) {
    this.trainerRepository = trainerRepository;
    this.userRepository = userRepository;
    this.subscriptionRepository = subscriptionRepository;
  }

  async applyTrainer(data: TrainerApplicationData): Promise<ITrainerModel> {
    try {
      const userId = new Types.ObjectId(data.userId);
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new CustomError(HttpResMsg.USER_NOT_FOUND, HttpResCode.NOT_FOUND);
      }

      const existingApplication = await this.trainerRepository.findOne({
        userId: user._id,
      });

      if (existingApplication && existingApplication.status !== "rejected") {
        throw new CustomError(
          HttpResMsg.TRAINER_APPLICATION_CONFLICT,
          HttpResCode.CONFLICT
        );
      }

      const trainerData = {
        userId: user._id as Types.ObjectId,
        username: user.username,
        email: user.email,
        phone: data.phone,
        profilePicture: user.profilePicture,
        specialization: data.specialization,
        yearsOfExperience: data.yearsOfExperience,
        about: data.about,
        documentProofs: data.documentProofs,
        certifications: data.certifications,
        achievements: data.achievements,
        // isApproved: false
      };

      const result = await this.trainerRepository.create(trainerData);
      return result;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Error applying for trainer position",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getApplicationStatus(
    userId: string
  ): Promise<{ status: string; reason?: string }> {
    try {
      const application = await this.trainerRepository.findOne({ userId });

      if (!application) {
        return { status: "none" };
      }

      return {
        status: application.status,
        reason: application.reason,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Error fetching application status",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async approveTrainer(trainerId: string): Promise<ITrainerModel> {
    try {
      const trainer = await this.trainerRepository.findById(
        new Types.ObjectId(trainerId)
      );
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_APPLICATION_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }

      trainer.status = "approved";
      await trainer.save();

      const user = await this.userRepository.findById(trainer.userId);
      if (!user) {
        throw new CustomError(HttpResMsg.USER_NOT_FOUND, HttpResCode.NOT_FOUND);
      }

      user.role = "trainer";
      await user.save();

      return trainer;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Error approving trainer application",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async rejectTrainer(
    trainerId: string,
    reason: string
  ): Promise<ITrainerModel> {
    try {
      const trainer = await this.trainerRepository.findById(
        new Types.ObjectId(trainerId)
      );
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_APPLICATION_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }

      trainer.status = "rejected";
      trainer.reason = reason;
      await trainer.save();

      return trainer;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Error rejecting trainer application",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTrainerApplications(isApproved?: boolean): Promise<ITrainerModel[]> {
    try {
      const filter = isApproved !== undefined ? { isApproved } : {};
      return this.trainerRepository.find(filter);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Error fetching trainer applications",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getApprovedTrainers(
    specialization: string,
    page: number,
    limit: number,
    searchTerm: string
  ): Promise<GetApprovedTrainersResponse> {
    try {
      const filter: FilterQuery<ITrainerModel> = { status: "approved" };
      if (specialization) {
        filter.specialization = new RegExp(specialization, "i");
      }
      if (searchTerm) {
        filter.$or = [
          { username: new RegExp(searchTerm, "i") },
          { email: new RegExp(searchTerm, "i") },
        ];
      }

      const totalCount = await this.trainerRepository.countDocuments(filter);
      const skip = (page - 1) * limit;
      const paginatedTrainers =
        await this.trainerRepository.findApprovedTrainers(filter, skip, limit);

      if (paginatedTrainers.length === 0) {
        return { trainers: [], totalCount: totalCount };
      }

      const trainerRatings = await Promise.all(
        paginatedTrainers.map((trainer) =>
          this.reviewRepository.getAverageRating(trainer._id as Types.ObjectId)
        )
      );

      const trainersWithRatings = paginatedTrainers.map((trainer, index) => ({
        ...trainer.toObject(),
        rating: trainerRatings[index],
      }));

      return {
        trainers: trainersWithRatings,
        totalCount: totalCount,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Error fetching approved trainers",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getOneTrainerDetails(trainerId: string): Promise<ITrainerModel> {
    try {
      const trainer = await this.trainerRepository.findById(
        new Types.ObjectId(trainerId)
      );
      if (!trainer) {
        throw new CustomError(HttpResMsg.NOT_FOUND, HttpResCode.NOT_FOUND);
      }
      return trainer;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Error fetching trainer details",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSubscribedTrainersDetails(
    userId: string
  ): Promise<SubscribedTrainerWithExpiry[]> {
    try {
      const activeSubscriptions = await this.subscriptionRepository.find({
        userId: new Types.ObjectId(userId),
        status: "active",
        expiryDate: { $gt: new Date() },
      });

      if (activeSubscriptions.length === 0) {
        return [];
      }

      const trainerExpiryMap = new Map<string, Date>();
      const subscribedTrainerIds = new Set<string>();

      activeSubscriptions.forEach((sub) => {
        const trainerIdStr = sub.trainerId.toString();
        trainerExpiryMap.set(trainerIdStr, sub.expiryDate!);
        subscribedTrainerIds.add(trainerIdStr);
      });

      const subscribedTrainers = await this.trainerRepository.find({
        _id: {
          $in: Array.from(subscribedTrainerIds).map(
            (id) => new Types.ObjectId(id)
          ),
        },
      });

      const trainersWithExpiry: SubscribedTrainerWithExpiry[] =
        subscribedTrainers.map((trainer) => {
          const trainerIdStr = trainer.id.toString();
          const expiryDate = trainerExpiryMap.get(trainerIdStr);

          if (!expiryDate) {
            console.warn(
              `Expiry date not found for trainer ${trainerIdStr}. Skipping.`
            );
            throw new CustomError(
              "Internal server error: Mismatched subscription data.",
              HttpResCode.INTERNAL_SERVER_ERROR
            );
          }

          return {
            ...trainer.toObject(),
            subscriptionExpiryDate: expiryDate,
          };
        });

      return trainersWithExpiry;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Error fetching subscribed trainers:",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getMyTrainees(
    page: number,
    limit: number,
    search: string,
    trainerUserId: string
  ): Promise<PaginatedTraineesResult> {
    try {
      const skip = (page - 1) * limit;

      const trainer = await this.trainerRepository.findOne({
        userId: trainerUserId,
      });
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }

      const trainerId = trainer._id;

      const subscriptions = await this.subscriptionRepository
        .find({ trainerId })
        .populate({
          path: "userId",
          select: "_id username profilePicture email isBlocked  createdAt",
          match: search
            ? {
                $or: [
                  { username: { $regex: search, $options: "i" } },
                  { email: { $regex: search, $options: "i" } },
                ],
              }
            : {},
        });

      const validSubscriptions = subscriptions.filter(
        (sub) => sub.userId !== null
      );

      const uniqueTraineeIds = [
        ...new Set(validSubscriptions.map((sub) => sub.userId._id.toString())),
      ];

      const [trainees, total] = await Promise.all([
        this.userRepository
          .find({ _id: { $in: uniqueTraineeIds } })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.userRepository.countDocuments({ _id: { $in: uniqueTraineeIds } }),
      ]);

      const allTraineeSubscriptions = await this.subscriptionRepository
        .find({
          trainerId: trainerId,
          userId: { $in: uniqueTraineeIds },
        })
        .sort({ createdAt: -1 });

      const formattedTrainees = trainees.map((trainee) => {
        const traineeSubscriptions = allTraineeSubscriptions.filter(
          (sub) =>
            (sub.userId as Types.ObjectId).toString() === trainee.id.toString()
        );

        return {
          traineeId: trainee.id.toString(),
          username: trainee.username,
          profilePicture: trainee.profilePicture || "",
          email: trainee.email,
          isBlocked: trainee.isBlocked,
          createdAt: trainee.createdAt,
          subscriptionHistory: traineeSubscriptions.map((sub) => ({
            _id: sub._id.toString(),
            startDate: sub.startDate,
            expiryDate: sub.expiryDate,
            planDuration: sub.planDuration as string,
            amount: sub.amount as number,
            status: sub.status,
          })),
        };
      });

      return { trainees: formattedTrainees, total };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Error fetching trainees",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTraineeDetails(
    traineeId: string,
    trainerUserId: string
  ): Promise<TraineeData> {
    try {
      const trainer = await this.trainerRepository.findOne({
        userId: trainerUserId,
      });
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }
      const actualTrainerDbId = trainer._id;

      const traineeUserDoc = await this.userRepository.findById(
        new Types.ObjectId(traineeId)
      );
      if (!traineeUserDoc) {
        throw new CustomError(
          HttpResMsg.TRAINEE_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }

      const relevantSubscriptions = await this.subscriptionRepository
        .find({
          trainerId: actualTrainerDbId,
          userId: traineeUserDoc._id,
        })
        .sort({ createdAt: -1 })
        .exec();

      const formattedSubscriptionHistory = relevantSubscriptions.map((sub) => ({
        _id: sub._id.toString(),
        startDate: sub.startDate,
        expiryDate: sub.expiryDate,
        planDuration: sub.planDuration as string,
        amount: sub.amount as number,
        status: sub.status,
      }));

      const result: TraineeData = {
        traineeId: traineeUserDoc.id.toString(),
        username: traineeUserDoc.username,
        profilePicture: traineeUserDoc.profilePicture || "",
        email: traineeUserDoc.email,
        isBlocked: traineeUserDoc.isBlocked,
        createdAt: traineeUserDoc.createdAt,
        subscriptionHistory: formattedSubscriptionHistory,
      };

      return result;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Error fetching trainee details",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
