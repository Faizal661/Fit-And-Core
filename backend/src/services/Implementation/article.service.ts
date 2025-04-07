import { inject, injectable } from 'tsyringe';
import { IArticle } from '../../types/article.types';
import { IArticleRepository } from '../../repositories/Interface/IArticleRepository';
import { IArticleService } from '../Interface/IArticleService';
import { IArticleModel } from '../../models/article.models';
import { Types } from 'mongoose';

@injectable()
export default class articleService implements IArticleService{
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository
  ) {
    this.articleRepository=articleRepository
  }

  async createArticle(articleData: IArticle): Promise<IArticleModel> {

    return await this.articleRepository.create(articleData);
  }

  async getAllArticles(): Promise<IArticleModel[]> {
    return await this.articleRepository.findAll();
  }

  async getArticleById(id: string): Promise<IArticleModel | null> {
    return await this.articleRepository.findById(new Types.ObjectId(id));
  }
}
