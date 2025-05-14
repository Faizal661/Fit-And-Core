import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { ITrainerService } from "../Interface/ITrainerService";
import { ITrainerRepository } from "../../repositories/Interface/ITrainerRepository";
import { IUserRepository } from "../../repositories/Interface/IUserRepository";
import { ISubscriptionRepository } from "../../repositories/Interface/ISubscriptionRepository";
import { TrainerApplicationData } from "../../types/trainer.types";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { CustomError } from "../../errors/CustomError";
import { ITrainerModel } from "../../models/trainer.models";
import { PaginatedTraineesResult } from "../../types/trainee.types";
import { IUserModel } from "../../models/user.models";

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
    subscriptionRepository: ISubscriptionRepository
  ) {
    this.trainerRepository = trainerRepository;
    this.userRepository = userRepository;
    this.subscriptionRepository = subscriptionRepository;
  }

  async applyTrainer(data: TrainerApplicationData): Promise<ITrainerModel> {
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
  }

  async getApplicationStatus(
    userId: string
  ): Promise<{ status: string; reason?: string }> {
    const application = await this.trainerRepository.findOne({ userId });

    if (!application) {
      return { status: "none" };
    }

    return {
      status: application.status,
      reason: application.reason,
    };
  }

  async approveTrainer(trainerId: string): Promise<ITrainerModel> {
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
  }

  async rejectTrainer(
    trainerId: string,
    reason: string
  ): Promise<ITrainerModel> {
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
  }

  async getTrainerApplications(isApproved?: boolean): Promise<ITrainerModel[]> {
    const filter = isApproved !== undefined ? { isApproved } : {};
    return this.trainerRepository.find(filter);
  }

  async getApprovedTrainers(): Promise<ITrainerModel[]> {
    const filter = { status: "approved" };
    return this.trainerRepository.find(filter);
  }

  async getOneTrainerDetails(trainerId: string): Promise<ITrainerModel> {
    const trainer = await this.trainerRepository.findById(
      new Types.ObjectId(trainerId)
    );
    if (!trainer) {
      throw new CustomError(HttpResMsg.NOT_FOUND, HttpResCode.NOT_FOUND);
    }
    return trainer;
  }

  async getSubscribedTrainersDetails(userId: string): Promise<ITrainerModel[]> {
    try {
      const activeSubscriptions = await this.subscriptionRepository.find({
        userId: new Types.ObjectId(userId),
        status: "active",
        expiryDate: { $gt: new Date() },
      });

      const subscribedTrainerIds = activeSubscriptions.map(
        (sub) => sub.trainerId
      );

      if (subscribedTrainerIds.length === 0) {
        return [];
      }

      const subscribedTrainers = await this.trainerRepository.find({
        _id: { $in: subscribedTrainerIds },
      });

      return subscribedTrainers;
    } catch (error) {
      // console.error('Error fetching subscribed trainers:', error);
      throw error;
    }
  }

  async getMyTrainees(
    page: number,
    limit: number,
    search: string,
    trainerUserId: string
  ): Promise<PaginatedTraineesResult> {
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
          status:sub.status
        })),
      };
    });

    return { trainees: formattedTrainees, total };
  }
}
