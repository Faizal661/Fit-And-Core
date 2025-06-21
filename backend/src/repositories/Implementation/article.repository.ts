import { injectable } from "tsyringe";
import { ArticleModel, IArticleModel } from "../../models/article.models";
import { IArticle } from "../../types/article.types";
import { BaseRepository } from "./base.repository";
import { IArticleRepository } from "../Interface/IArticleRepository";
import { FilterQuery } from "mongoose";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class ArticleRepository
  extends BaseRepository<IArticleModel>
  implements IArticleRepository
{
  constructor() {
    super(ArticleModel);
  }
  async countDocuments(filter: FilterQuery<IArticleModel>): Promise<number> {
    try {
      return this.model.countDocuments(filter);
    } catch (error) {
      throw new CustomError(
        "failed to fetch document count",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
