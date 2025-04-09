import { BaseRepository } from "../Implementation/base.repository";
import { ITrainerModel } from "../../models/trainer.models";

export interface ITrainerRepository
  extends Omit<BaseRepository<ITrainerModel>, "model"> {}
