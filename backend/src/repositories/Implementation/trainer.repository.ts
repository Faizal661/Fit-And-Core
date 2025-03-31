import { injectable } from "tsyringe";
import TrainerModel, { ITrainerModel } from "../../models/trainer.models";
import { BaseRepository } from "./base.repository";
import { ITrainerRepository } from "../Interface/ITrainerRepository";
import { ITrainer } from "../../types/trainer.types";

@injectable()
export class TrainerRepository
  extends BaseRepository<ITrainerModel>
  implements ITrainerRepository
{
  constructor() {
    super(TrainerModel);
  }

}