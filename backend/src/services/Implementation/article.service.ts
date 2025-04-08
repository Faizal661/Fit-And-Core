import { inject, injectable } from 'tsyringe';
import { IArticle } from '../../types/article.types';
import { IArticleRepository } from '../../repositories/Interface/IArticleRepository';
import { IArticleService } from '../Interface/IArticleService';
import { IArticleModel } from '../../models/article.models';
import { Types } from 'mongoose';
import { IUserRepository } from '../../repositories/Interface/IUserRepository';

@injectable()
export default class articleService implements IArticleService{
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository,
    @inject("UserRepository") private userRepository: IUserRepository
  ) {
    this.articleRepository=articleRepository
    this.userRepository=userRepository
  }

  async createArticle(articleData: IArticle): Promise<IArticleModel> {
    const currentUser = await this.userRepository.findById(new Types.ObjectId(articleData.createdBy));
    const authorName=currentUser?.username
    return await this.articleRepository.create({...articleData,authorName});
  }

  async getMyArticles(trainerId:string | Types.ObjectId): Promise<IArticleModel[]> {
    return await this.articleRepository.find({createdBy:new Types.ObjectId(trainerId)});
  }

  async getAllArticles(): Promise<IArticleModel[]> {
    return await this.articleRepository.findAll();
  }

  async getArticleById(id: string): Promise<IArticleModel | null> {
    return await this.articleRepository.findById(new Types.ObjectId(id));
  }
}
