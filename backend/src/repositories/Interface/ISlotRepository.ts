import { BaseRepository } from "../Implementation/base.repository";
import { ISlotModel } from "../../models/session.model/slot.models";

export interface ISlotRepository 
  extends Omit<BaseRepository<ISlotModel>, "model"> {
    createMany(data: Partial<ISlotModel>[]): Promise<ISlotModel[]>;

}