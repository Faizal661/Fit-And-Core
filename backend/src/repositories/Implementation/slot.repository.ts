import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import SlotModel, { ISlotModel } from "../../models/session.model/slot.models";
import { ISlotRepository } from "../Interface/ISlotRepository";
import { FilterQuery, Types } from "mongoose";
import { ISlot } from "../../types/session.types";

@injectable()
export class SlotRepository
  extends BaseRepository<ISlotModel>
  implements ISlotRepository
{
  constructor() {
    super(SlotModel);
  }
  
  async createMany(data: Partial<ISlotModel>[]): Promise<ISlotModel[]> {
    const createdSlots = await SlotModel.insertMany(data);
    return createdSlots as ISlotModel[];
  }

  async findSlotsByAvailabilityIds(
    availabilityIds: Types.ObjectId[] 
  ): Promise<ISlotModel[]> {
    if (availabilityIds.length === 0) {
      return [];
    }

    const filter: FilterQuery<ISlotModel> = {
      availabilityId: { $in: availabilityIds },
    };

    return this.model.find(filter).sort({ startTime: 1 }).exec();
  }

  async cancelAvailableSlot(
    slotId: Types.ObjectId,
    trainerId: Types.ObjectId
  ): Promise<ISlotModel | null> {
    const filter: FilterQuery<ISlotModel> = {
      _id: slotId,
      trainerId: trainerId, 
      status: 'available',  
    };

    const update = {
      status: 'canceled', 
    };
    return this.model.findOneAndUpdate(
      filter,
      update,
      { new: true, runValidators: true }
    ).exec();
  }

}
