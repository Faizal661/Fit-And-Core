import { HttpResCode } from "../../../constants/http-response.constants";
import CustomError from "../../../errors/CustomError";
import {
  GroupModel,
  IGroupModel,
  IGroup,
} from "../../../models/group.model/group.models";
import { Types } from "mongoose";

export class GroupRepository {
  async create(groupData: Partial<IGroup>): Promise<IGroupModel> {
    try {
      const group = new GroupModel(groupData);
      await group.save();
      return group;
    } catch (error) {
      throw new CustomError(
        "failed to create group",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAndPaginate(
    page: number,
    limit: number,
    searchTerm?: string
  ): Promise<{ groups: IGroupModel[]; totalGroups: number }> {
    const skip = (page - 1) * limit;
    let query: any = {};

    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const groupsPromise = GroupModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const totalGroupsPromise = GroupModel.countDocuments(query).exec();

    const [groups, totalGroups] = await Promise.all([
      groupsPromise,
      totalGroupsPromise,
    ]);

    return { groups, totalGroups };
  }

  async findById(
    groupId: string | Types.ObjectId
  ): Promise<IGroupModel | null> {
    return GroupModel.findById(groupId).exec();
  }
}
