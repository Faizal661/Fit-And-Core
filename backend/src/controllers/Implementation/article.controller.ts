import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { IArticleService } from "../../services/Interface/IArticleService";
import { sendResponse } from "../../utils/send-response";
import { HttpResCode, HttpResMsg } from "../../constants/response.constants";
import { IArticleController } from "../Interface/IArticleController";
import { uploadToCloudinary } from "../../utils/s3-upload";

@injectable()
export class ArticleController implements IArticleController {
  private articleService: IArticleService;

  constructor(
    @inject("ArticleService")
    articleService: IArticleService
  ) {
    this.articleService = articleService;
  }

  async createArticle(req: Request, res: Response, next: NextFunction) {
    const { title, content, tags } = req.body;

    let thumbnailURL = null;
    if (req.file) {
      const thumbnailFile = req.file;
      const uploadResult = await uploadToCloudinary(
        thumbnailFile,
        "thumbnails"
      );
      thumbnailURL = uploadResult.Location;
    }

    if (thumbnailURL === null) {
      sendResponse(res, HttpResCode.BAD_REQUEST, "No thumbnail uploaded");
      return;
    }

    const createdBy = req.decoded?.id;
    if (!createdBy) {
      sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
      return;
    }

    const article = await this.articleService!.createArticle({
      title,
      content,
      tags,
      thumbnail:thumbnailURL,
      createdBy,
    });
    sendResponse(res, HttpResCode.CREATED, HttpResMsg.SUCCESS, { article });
  }

  async getAllArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const articles = await this.articleService!.getAllArticles();
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { articles });
    } catch (error) {
      next(error);
    }
  }

  async getArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const article = await this.articleService!.getArticleById(req.params.id);
      if (!article) {
        sendResponse(res, HttpResCode.NOT_FOUND, HttpResMsg.NOT_FOUND);
        return;
      }
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, article);
    } catch (error) {
      next(error);
    }
  }
}
