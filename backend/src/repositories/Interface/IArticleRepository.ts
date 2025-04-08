import { BaseRepository } from "../Implementation/base.repository";
import { IArticleModel } from "../../models/article.models";
import { FilterQuery } from "mongoose";

export interface IArticleRepository
  extends Omit<BaseRepository<IArticleModel>, "model"> {
  countDocuments(filter: FilterQuery<IArticleModel>): Promise<number>;
}
