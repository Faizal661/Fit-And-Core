import { Types } from "mongoose";
import { IArticleModel } from "../../models/article.models";
import { FetchUpvotedUsersData, IArticle, articleResponse } from "../../types/article.types";

export interface IArticleService {
  createArticle(articleData: IArticle): Promise<IArticleModel>;
  updateArticle(id: string, articleData: Partial<IArticle>): Promise<IArticleModel | null>;
  getMyArticles(
    trainerId: string | Types.ObjectId,
    page: number,
    limit: number,
    search?: string,
    sortBy?: "createdAt" | "upvotes"
  ): Promise<articleResponse>;
  getAllArticles(
    page: number,
    limit: number,
    search: string,
    sortBy?: "createdAt" | "upvotes"
  ): Promise<articleResponse>;
  getArticleById(articleId: string): Promise<IArticleModel | null>;
  toggleUpvote(articleId: string, userId: string): Promise<IArticleModel>;
  getUpvotersByArticle(
    articleId:string,
    page: number,
    limit: number,
  ): Promise<FetchUpvotedUsersData>;
  deleteArticle(articleId: string, userId: string): Promise<void>
}
