import { inject, injectable } from "tsyringe";
import {
  FetchUpvotedUsersData,
  IArticle,
  UpvotedUsers,
  articleResponse,
} from "../../types/article.types";
import { IArticleRepository } from "../../repositories/Interface/IArticleRepository";
import { IArticleService } from "../Interface/IArticleService";
import { IArticleModel } from "../../models/article.models";
import { Types } from "mongoose";
import { IUserRepository } from "../../repositories/Interface/IUserRepository";
import { FilterQuery } from "mongoose";
import { sendResponse } from "../../utils/send-response";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import CustomError from "../../errors/CustomError";

@injectable()
export default class ArticleService implements IArticleService {
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository,
    @inject("UserRepository") private userRepository: IUserRepository
  ) {
    this.articleRepository = articleRepository;
    this.userRepository = userRepository;
  }

  async createArticle(articleData: IArticle): Promise<IArticleModel> {
    const currentUser = await this.userRepository.findById(
      new Types.ObjectId(articleData.createdBy)
    );
    const authorName = currentUser?.username;
    return await this.articleRepository.create({ ...articleData, authorName });
  }

  async updateArticle(
    id: string,
    articleData: Partial<IArticle>
  ): Promise<IArticleModel | null> {
    return await this.articleRepository.update(new Types.ObjectId(id), {
      ...articleData,
    });
  }

  async getMyArticles(
    trainerId: string | Types.ObjectId,
    page: number,
    limit: number,
    search?: string,
    sortBy?: "createdAt" | "upvotes"
  ): Promise<articleResponse> {
    const skip = (page - 1) * limit;
    const query: FilterQuery<IArticleModel> = {
      createdBy: new Types.ObjectId(trainerId),
    };
    const sortOptions: Record<string, 1 | -1> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (sortBy === "createdAt") {
      sortOptions.createdAt = -1;
    } else if (sortBy === "upvotes") {
      sortOptions["upvotes"] = -1;
    }

    const [articles, total] = await Promise.all([
      this.articleRepository
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortOptions)
        .exec(),
      this.articleRepository.countDocuments(query),
    ]);

    if (sortBy === "upvotes") {
      articles.sort(
        (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
      );
    }

    return { articles, total };
  }

  async getAllArticles(
    page: number,
    limit: number,
    search: string,
    sortBy?: "createdAt" | "upvotes"
  ): Promise<articleResponse> {
    const skip = (page - 1) * limit;
    const query: FilterQuery<IArticleModel> = {};
    const sortOptions: Record<string, 1 | -1> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { authorName: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (sortBy === "createdAt") {
      sortOptions.createdAt = -1;
    } else if (sortBy === "upvotes") {
      sortOptions["upvotes"] = -1;
    }

    const [articles, total] = await Promise.all([
      this.articleRepository
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortOptions)
        .exec(),
      this.articleRepository.countDocuments(query),
    ]);

    if (sortBy === "upvotes") {
      articles.sort(
        (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
      );
    }

    return { articles, total };
  }

  async getArticleById(id: string): Promise<IArticleModel | null> {
    return await this.articleRepository.findById(new Types.ObjectId(id));
  }

  async toggleUpvote(
    articleId: string,
    userId: string
  ): Promise<IArticleModel> {
    const article = await this.articleRepository.findById(
      new Types.ObjectId(articleId)
    );
    if (!article) {
      throw new CustomError(
        HttpResMsg.ARTICLE_NOT_FOUND,
        HttpResCode.NOT_FOUND
      );
    }

    const isUpvoted = article.upvotes?.includes(userId);
    if (isUpvoted) {
      await this.articleRepository.updateOne(
        { _id: articleId },
        { $pull: { upvotes: userId } }
      );
    } else {
      await this.articleRepository.updateOne(
        { _id: articleId },
        { $push: { upvotes: userId } }
      );
    }

    const updatedArticle = await this.articleRepository.findById(
      new Types.ObjectId(articleId)
    );
    return updatedArticle!;
  }

  async getUpvotersByArticle(
    articleId: string,
    page: number,
    limit: number
  ): Promise<FetchUpvotedUsersData> {
    const article = await this.articleRepository.findById(
      new Types.ObjectId(articleId)
    );
    if (!article) {
      throw new CustomError(
        HttpResMsg.ARTICLE_NOT_FOUND,
        HttpResCode.NOT_FOUND
      );
    }
    const allUpvoterIds = article.upvotes || [];
    const totalUpvotes = allUpvoterIds.length;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUpvoterIds = allUpvoterIds.slice(startIndex, endIndex);

    if (paginatedUpvoterIds.length === 0) {
      return { users: [], hasMore: false };
    }

    const queryFilter = {
      _id: { $in: paginatedUpvoterIds.map((id) => new Types.ObjectId(id)) },
    };

    const upvoterUserDetails = await this.userRepository.find(queryFilter);

    const hasMore = totalUpvotes > endIndex;

    const users: UpvotedUsers[] = upvoterUserDetails.map((user) => ({
      _id: user.id.toString(),
      username: user.username,
      profilePicture: user.profilePicture,
    }));

    return { users, hasMore };
  }

  async deleteArticle(articleId: string, userId: string): Promise<void> {
    const articleObjectId = new Types.ObjectId(articleId);
    const userObjectId = new Types.ObjectId(userId);

    const article = await this.articleRepository.findById(articleObjectId);
    if (!article) {
      throw new CustomError(
        HttpResMsg.ARTICLE_NOT_FOUND,
        HttpResCode.NOT_FOUND
      );
    }

    if (article.createdBy.toString() !== userObjectId.toString()) {
      throw new CustomError(HttpResMsg.FORBIDDEN, HttpResCode.FORBIDDEN);
    }

    await this.articleRepository.delete(articleObjectId);
  }
}
