import { NextFunction, Request, Response } from "express";

export interface IArticleController {
  createArticle(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllArticles(req: Request, res: Response, next: NextFunction): Promise<void>
  getArticleById(req: Request, res: Response, next: NextFunction): Promise<void>
}
