import { Types } from "mongoose";

export interface IArticle {
    _id?: string;
    thumbnail: string ;
    title: string;
    content: string;
    tags: string[];
    createdBy: Types.ObjectId | string;
    upvotes?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  