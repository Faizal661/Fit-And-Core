import { Types } from "mongoose";
import { IArticleModel } from "../../models/article.models";
import { IArticle } from "../../types/article.types";

export interface articleResponse {
  articles:IArticleModel[];
  total: number;
}

export interface IArticleService {
  createArticle(articleData: IArticle): Promise<IArticleModel> 
  getMyArticles(trainerId:string | Types.ObjectId): Promise<IArticleModel[]>
  getAllArticles(page: number, limit: number, search: string): Promise<articleResponse>
  getArticleById(id: string): Promise<IArticleModel | null>
  toggleUpvote(articleId: string, userId: string): Promise<IArticleModel>
}