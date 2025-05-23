import { NextFunction, Request, Response } from "express";

export interface IArticleController {
  createArticle(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllArticles(req: Request, res: Response, next: NextFunction): Promise<void>
  getMyArticles(req: Request, res: Response, next: NextFunction): Promise<void>
  upvoteArticle(req: Request, res: Response, next: NextFunction): Promise<void>
  updateArticle(req: Request, res: Response, next: NextFunction): Promise<void>
  getArticleById(req: Request, res: Response, next: NextFunction): Promise<void>
  getUpvotersByArticle(req: Request, res: Response, next: NextFunction): Promise<void>
  deleteArticle( req: Request, res: Response, next: NextFunction ): Promise<void> 
}
