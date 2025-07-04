import { FilterQuery, ObjectId, Types } from "mongoose";
import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { ISubscription, SubscriptionsResponse } from "../../types/subscription.types";
import {
  SubscriptionModel,
  ISubscriptionModel,
} from "../../models/subscription.models";
import { ISubscriptionRepository } from "../../repositories/Interface/ISubscriptionRepository";
import { IUserModel } from "../../models/user.models";
import { ITrainerModel } from "../../models/trainer.models";
import { FinanceData } from "../../types/finance.types";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscriptionModel>
  implements ISubscriptionRepository
{
  constructor() {
    super(SubscriptionModel);
  }

  async findActiveSubscribedTrainers(
    traineeId: Types.ObjectId
  ): Promise<Types.ObjectId[]> {
    try {
      const subscriptions = await SubscriptionModel.find({
        userId: traineeId,
        status: "active",
        expiryDate: { $gt: new Date() },
      })
        .populate({
          path: "trainerId",
          populate: {
            path: "userId",
            model: "User",
          },
        })
        .exec();

      return subscriptions
        .map((sub) => {
          const trainer = sub.trainerId as unknown as ITrainerModel;
          const user = trainer?.userId;
          return user && typeof user === "object" && "_id" in user
            ? user._id
            : null;
        })
        .filter((id): id is Types.ObjectId => id !== null);
    } catch (error) {
      throw new CustomError(
        "failed to find active subscribed trainers",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findActiveSubscribedTrainees(
    trainerId: Types.ObjectId
  ): Promise<Types.ObjectId[]> {
    try {
      const subscriptions = await SubscriptionModel.find({
        trainerId: trainerId,
        status: "active",
        expiryDate: { $gt: new Date() },
      });

      return subscriptions.map((sub) => sub.userId);
    } catch (error) {
      throw new CustomError(
        "failed to find active subscribed trainees",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getFinanceAnalytics(start: Date, end: Date): Promise<FinanceData> {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyStats = await SubscriptionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            status: "$status",
          },
          revenue: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, "$amount", 0] },
          },
          refunds: {
            $sum: { $cond: [{ $eq: ["$status", "refunded"] }, "$amount", 0] },
          },
        },
      },
    ]);

    const monthMap: { [key: string]: { revenue: number; refunds: number } } =
      {};
    monthlyStats.forEach((stat) => {
      const key = `${stat._id.year}-${stat._id.month}`;
      if (!monthMap[key]) monthMap[key] = { revenue: 0, refunds: 0 };
      if (stat._id.status === "active") monthMap[key].revenue += stat.revenue;
      if (stat._id.status === "refunded") monthMap[key].refunds += stat.refunds;
    });

    const revenueByMonth: Array<{
      month: string;
      revenue: number;
      refunds: number;
      netIncome: number;
    }> = [];
    let current = new Date(start);
    while (current <= end) {
      const key = `${current.getFullYear()}-${current.getMonth() + 1}`;
      const monthName = months[current.getMonth()];
      const revenue = monthMap[key]?.revenue || 0;
      const refunds = monthMap[key]?.refunds || 0;
      revenueByMonth.push({
        month: monthName,
        revenue,
        refunds,
        netIncome: revenue - refunds,
      });
      current.setMonth(current.getMonth() + 1);
    }

    const totalRevenue = revenueByMonth.reduce((sum, m) => sum + m.revenue, 0);
    const totalRefunds = revenueByMonth.reduce((sum, m) => sum + m.refunds, 0);
    const netIncome = revenueByMonth.reduce((sum, m) => sum + m.netIncome, 0);

    const len = revenueByMonth.length;
    const prevMonthNet = len > 1 ? revenueByMonth[len - 2].netIncome : 0;
    const currMonthNet = len > 0 ? revenueByMonth[len - 1].netIncome : 0;
    const monthlyGrowth =
      prevMonthNet === 0
        ? 0
        : ((currMonthNet - prevMonthNet) / prevMonthNet) * 100;

    return {
      totalRevenue,
      totalRefunds,
      netIncome,
      monthlyGrowth: Number(monthlyGrowth.toFixed(2)),
      revenueByMonth,
    };
  }

  async refundSubscription(
    subscriptionId: Types.ObjectId
  ): Promise<ISubscriptionModel | null> {
    return SubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      { status: "refunded" },
      { new: true }
    ).exec();
  }

 async findAllSubscriptionsByUser(
  userId: Types.ObjectId,
  page: number,
  limit: number
): Promise<SubscriptionsResponse> {
  try {
    const skip = (page - 1) * limit;
    
    // Get total count of subscriptions for this user
    const total = await SubscriptionModel.countDocuments({ userId: userId });
    const totalPages = Math.ceil(total / limit);

    const subscriptions = await SubscriptionModel
    .aggregate([
      {
          $match: {
            userId: userId,
          },
        },
        {
          $lookup: {
            from: "trainers", // Assuming your trainer collection is named "trainers"
            localField: "trainerId",
            foreignField: "_id",
            as: "trainerDetails",
          },
        },
        {
          $unwind: {
            path: "$trainerDetails",
            preserveNullAndEmptyArrays: true, // Keep subscriptions even if trainer not found
          },
        },
        {
          $sort: {
            createdAt: -1, // Newest subscriptions first
          },
        },
        {
          $project: {
            _id: 1,
            startDate: 1,
            expiryDate: 1,
            planDuration: 1,
            amount: 1,
            status: 1,
            trainerName: "$trainerDetails.username", // Map trainer username to trainerName
            trainerProfilePicture: "$trainerDetails.profilePicture", // Map trainer profile picture
          },
        },
        { $skip: skip },
        { $limit: limit },
      ])
      .exec();

    return {
      subscriptions,
      total,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    throw new CustomError(
      "failed to find all subscriptions by user",
      HttpResCode.INTERNAL_SERVER_ERROR
    );
  }
}
}
