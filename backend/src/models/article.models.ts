import { Schema, model, Types, Document } from "mongoose";
import { IArticle } from "../types/article.types";

export interface IArticleModel extends Document, Omit<IArticle, "_id"> {}

const articleSchema = new Schema<IArticleModel>(
  {
    thumbnail: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    authorName: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export const ArticleModel = model<IArticleModel>("Article", articleSchema);

export default ArticleModel;
