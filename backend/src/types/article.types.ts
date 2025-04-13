import { Types } from "mongoose";
import { IArticleModel } from "../models/article.models";

export interface IArticle {
  _id?: string;
  thumbnail: string;
  title: string;
  content: string;
  tags: string[];
  createdBy: Types.ObjectId | string;
  authorName?: string;
  upvotes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface articleResponse {
  articles: IArticleModel[];
  total: number;
}
