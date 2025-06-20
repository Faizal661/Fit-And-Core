import {
  GroupMemberModel,
  IGroupMember,
  IGroupMemberModel,
} from "../../../models/group.model/group-member.models";
import { Types } from "mongoose";
import { BaseRepository } from "../base.repository";
import { GroupMemberWithUser } from "../../../services/Implementation/group.service";
import { IMessage } from "../../../models/group.model/group-messages.models";
import { CustomError } from "../../../errors/CustomError";
import { HttpResCode } from "../../../constants/http-response.constants";

export class GroupMemberRepository extends BaseRepository<IGroupMemberModel> {
  constructor() {
    super(GroupMemberModel);
  }

  async countActiveMembersInGroup(groupId: Types.ObjectId): Promise<number> {
    try {
      return GroupMemberModel.countDocuments({
        groupId: groupId,
        status: "active",
      }).exec();
    } catch (error) {
      throw new CustomError(
        "failed to count active members in group",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createMember(
    groupId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<IGroupMemberModel> {
    try {
      const member = new GroupMemberModel({
        groupId,
        userId,
        status: "active",
      });
      return member.save();
    } catch (error) {
      throw new CustomError(
        "failed to create member",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findMember(
    groupId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<IGroupMemberModel | null> {
    try {
      return GroupMemberModel.findOne({ groupId, userId }).exec();
    } catch (error) {
      throw new CustomError(
        "failed to find member",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findActiveGroupMembersForUser(
    userId: Types.ObjectId
  ): Promise<IGroupMemberModel[]> {
    try {
      return GroupMemberModel.find({
        userId: userId,
        status: "active",
      })
        .populate("groupId")
        .exec();
    } catch (error) {
      throw new CustomError(
        "failed to find active group members",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAndPaginateMembers(
    groupId: Types.ObjectId,
    page: number,
    limit: number,
    searchTerm?: string,
    statusFilter?: "active" | "left" | "kicked" | "blocked" | "all"
  ): Promise<{ members: GroupMemberWithUser[]; totalMembers: number }> {
    const skip = (page - 1) * limit;
    let matchQuery: Partial<IGroupMember> = { groupId: groupId };

    if (statusFilter && statusFilter !== "all") {
      matchQuery.status = statusFilter;
    }

    const pipeline: any[] = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },

      ...(searchTerm
        ? [
            {
              $match: {
                $or: [
                  { "userId.username": { $regex: searchTerm, $options: "i" } },
                  { "userId.email": { $regex: searchTerm, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      { $sort: { joinedAt: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const membersPromise = GroupMemberModel.aggregate(pipeline).exec();

    const countPipeline: any[] = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },
      ...(searchTerm
        ? [
            {
              $match: {
                $or: [
                  { "userId.username": { $regex: searchTerm, $options: "i" } },
                  { "userId.email": { $regex: searchTerm, $options: "i" } },
                ],
              },
            },
          ]
        : []),
      { $count: "total" },
    ];
    const totalMembersPromise =
      GroupMemberModel.aggregate(countPipeline).exec();

    const [members, totalCountResult] = await Promise.all([
      membersPromise,
      totalMembersPromise,
    ]);

    const totalMembers =
      totalCountResult.length > 0 ? totalCountResult[0].total : 0;

    return { members: members as GroupMemberWithUser[], totalMembers };
  }

  async updateMemberStatus(
    groupId: Types.ObjectId,
    userId: Types.ObjectId,
    status: "active" | "left" | "kicked" | "blocked"
  ): Promise<IGroupMemberModel | null> {
    const update: Partial<IGroupMember> = { status };
    if (status === "kicked") {
      update.kickedAt = new Date();
    } else if (status === "blocked") {
      update.blockedAt = new Date();
    } else if (status === "left") {
      update.leaveAt = new Date();
    } else if (status === "active") {
      update.kickedAt = null;
      update.blockedAt = null;
      update.leaveAt = null;
    }

    return GroupMemberModel.findOneAndUpdate(
      { groupId, userId },
      { $set: update },
      { new: true }
    ).exec();
  }

  async checkMembershipStatusForUserInGroups(
    userId: Types.ObjectId,
    groupIds: Types.ObjectId[]
  ): Promise<Map<string, boolean>> {
    const memberships = await GroupMemberModel.find({
      userId: userId,
      groupId: { $in: groupIds },
      status: "active",
    })
      .select("groupId")
      .exec();

    const joinedGroupIds = new Set<string>();
    memberships.forEach((member) => {
      joinedGroupIds.add(member.groupId.toString());
    });

    const result = new Map<string, boolean>();
    groupIds.forEach((groupId) => {
      result.set(groupId.toString(), joinedGroupIds.has(groupId.toString()));
    });

    return result;
  }

  async joinGroup(
    groupId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<IGroupMemberModel> {
    const existingMembership = await GroupMemberModel.findOneAndUpdate(
      { groupId, userId },
      {
        $set: {
          status: "active",
          leaveAt: null,
          kickedAt: null,
          blockedAt: null,
        },
        $setOnInsert: { joinedAt: new Date() },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    if (!existingMembership) {
      throw new Error("Failed to create or update group membership.");
    }
    return existingMembership;
  }
}
