import { Types } from "mongoose";
import { IArticleModel } from "../../models/article.models";
import { IArticle } from "../../types/article.types";

export interface IArticleService {
  createArticle(articleData: IArticle): Promise<IArticleModel> 
  getMyArticles(trainerId:string | Types.ObjectId): Promise<IArticleModel[]>
  getAllArticles(): Promise<IArticleModel[]>
  getArticleById(id: string): Promise<IArticleModel | null>
}