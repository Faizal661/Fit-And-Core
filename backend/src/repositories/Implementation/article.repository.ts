import { injectable } from 'tsyringe';
import { ArticleModel,IArticleModel } from '../../models/article.models';
import { IArticle } from '../../types/article.types';
import { BaseRepository } from "./base.repository";
import { IArticleRepository } from '../Interface/IArticleRepository';

@injectable()
export class ArticleRepository  extends BaseRepository<IArticleModel>
implements IArticleRepository
{
constructor() {
  super(ArticleModel);
}

}
