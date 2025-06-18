import { GroupModel, IGroupModel, IGroup } from '../../../models/group.model/group.models';
import { Types } from 'mongoose';

export class GroupRepository {

  async create(groupData: Partial<IGroup>): Promise<IGroupModel> {
    const group = new GroupModel(groupData);
    await group.save();
    return group;
  }

  async findAndPaginate(page: number, limit: number, searchTerm?: string): Promise<{ groups: IGroupModel[]; totalGroups: number }> {
    const skip = (page - 1) * limit;
    let query: any = {};

    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const groupsPromise = GroupModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) 
      .exec();

    const totalGroupsPromise = GroupModel.countDocuments(query).exec();

    const [groups, totalGroups] = await Promise.all([groupsPromise, totalGroupsPromise]);

    return { groups, totalGroups };
  }


  async findById(groupId: string | Types.ObjectId): Promise<IGroupModel | null> {
    return GroupModel.findById(groupId).exec();
  }
}