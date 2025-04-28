import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import SlotModel, { ISlotModel } from "../../models/session.model/slot.models";
import { ISlotRepository } from "../Interface/ISlotRepository";

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
}
