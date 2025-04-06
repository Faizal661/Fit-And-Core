import { BaseRepository } from "../Implementation/base.repository";
import { IArticleModel } from "../../models/article.models";

export interface IArticleRepository
  extends Omit<BaseRepository<IArticleModel>, "model"> {}
