import { injectable } from "tsyringe";
import ReportModel, { IReportModel } from "../../models/report.models";
import { IReportRepository } from "../Interface/IReportRepository";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";

@injectable()
export class ReportRepository
  extends BaseRepository<IReportModel>
  implements IReportRepository
{
  constructor() {
    super(ReportModel);
  }

  async getPaginatedReports(
    page: number,
    limit: number,
    status?: "pending" | "in_review" | "resolved" | "rejected"
  ): Promise<{
    reports: any[];
    totalReports: number;
    totalPages: number;
    currentPage: number;
  }> {
    const match: any = {};
    if (status) match.status = status;

    const skip = (page - 1) * limit;

    const [reports, totalReports] = await Promise.all([
      ReportModel.aggregate([
        { $match: match },
        {
          $lookup: {
            from: "users",
            localField: "reportedUserId",
            foreignField: "_id",
            as: "reportedUser",
          },
        },
        { $unwind: "$reportedUser" },
        {
          $lookup: {
            from: "users",
            localField: "reporterUserId",
            foreignField: "_id",
            as: "reporterUser",
          },
        },
        { $unwind: "$reporterUser" },
        {
          $project: {
            _id: 1,
            bookingId: 1,
            reportedUserId: {
              _id: "$reportedUser._id",
              username: "$reportedUser.username",
              profilePicture: "$reportedUser.profilePicture",
            },
            reporterUserId: {
              _id: "$reporterUser._id",
              username: "$reporterUser.username",
              profilePicture: "$reporterUser.profilePicture",
            },
            reporterType: 1,
            message: 1,
            status: 1,
            resolutionDetails: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      ReportModel.countDocuments(match),
    ]);

    const totalPages = Math.ceil(totalReports / limit);

    return {
      reports,
      totalReports,
      totalPages,
      currentPage: page,
    };
  }

  async getPaginatedUserReports(
    userId: string,
    page: number,
    limit: number,
    status?: "pending" | "in_review" | "resolved" | "rejected"
  ): Promise<{
    reports: any[];
    totalReports: number;
    totalPages: number;
    currentPage: number;
  }> {
    const match: any = { reporterUserId: new Types.ObjectId(userId) };
    if (status) match.status = status;

    const skip = (page - 1) * limit;

    const [reports, totalReports] = await Promise.all([
      ReportModel.aggregate([
        { $match: match },
        {
          $lookup: {
            from: "users",
            localField: "reportedUserId",
            foreignField: "_id",
            as: "reportedUser",
          },
        },
        { $unwind: "$reportedUser" },
        {
          $lookup: {
            from: "users",
            localField: "reporterUserId",
            foreignField: "_id",
            as: "reporterUser",
          },
        },
        { $unwind: "$reporterUser" },
        {
          $project: {
            _id: 1,
            bookingId: 1,
            reportedUserId: {
              _id: "$reportedUser._id",
              username: "$reportedUser.username",
              profilePicture: "$reportedUser.profilePicture",
            },
            reporterUserId: {
              _id: "$reporterUser._id",
              username: "$reporterUser.username",
              profilePicture: "$reporterUser.profilePicture",
            },
            reporterType: 1,
            message: 1,
            status: 1,
            resolutionDetails: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      ReportModel.countDocuments(match),
    ]);

    const totalPages = Math.ceil(totalReports / limit);

    return {
      reports,
      totalReports,
      totalPages,
      currentPage: page,
    };
  }
}
