import { Types } from "mongoose";
import { IArticleModel } from "../../models/article.models";
import { IArticle, articleResponse } from "../../types/article.types";

export interface IArticleService {
  createArticle(articleData: IArticle): Promise<IArticleModel> 
  getMyArticles(trainerId:string | Types.ObjectId): Promise<IArticleModel[]>
  getAllArticles(page: number, limit: number, search: string): Promise<articleResponse>
  getArticleById(articleId: string): Promise<IArticleModel | null>
  toggleUpvote(articleId: string, userId: string): Promise<IArticleModel>
}