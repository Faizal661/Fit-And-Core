import { inject, injectable } from "tsyringe";
import { IArticle } from "../../types/article.types";
import { IArticleRepository } from "../../repositories/Interface/IArticleRepository";
import { IArticleService, articleResponse } from "../Interface/IArticleService";
import { IArticleModel } from "../../models/article.models";
import { Types } from "mongoose";
import { IUserRepository } from "../../repositories/Interface/IUserRepository";
import { FilterQuery } from "mongoose";

@injectable()
export default class articleService implements IArticleService {
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

  async getMyArticles(
    trainerId: string | Types.ObjectId
  ): Promise<IArticleModel[]> {
    return await this.articleRepository.find({
      createdBy: new Types.ObjectId(trainerId),
    });
  }

  async getAllArticles(
    page: number,
    limit: number,
    search: string
  ): Promise<articleResponse> {
    const skip = (page - 1) * limit;
    const query: FilterQuery<IArticleModel> = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { authorName: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const [articles, total] = await Promise.all([
      this.articleRepository.find(query).skip(skip).limit(limit).exec(),
      this.articleRepository.countDocuments(query),
    ]);

    return {articles, total} ;
  }

  async getArticleById(id: string): Promise<IArticleModel | null> {
    return await this.articleRepository.findById(new Types.ObjectId(id));
  }
}
