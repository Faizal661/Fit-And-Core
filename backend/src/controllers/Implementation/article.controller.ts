import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { IArticleService } from "../../services/Interface/IArticleService";
import { sendResponse } from "../../utils/send-response";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { IArticleController } from "../Interface/IArticleController";
import { uploadToCloudinary } from "../../utils/s3-upload";
import { CustomError } from "../../errors/CustomError";

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
      sendResponse(res, HttpResCode.BAD_REQUEST, HttpResMsg.NO_FILE_UPLOADED);
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
      thumbnail: thumbnailURL,
      createdBy,
    });
    sendResponse(res, HttpResCode.CREATED, HttpResMsg.SUCCESS, { article });
  }

  async getMyArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const trainerId = req.decoded?.id;
      if (!trainerId) {
        sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
        return;
      }

      const { page = 1, limit = 5, search, sortBy } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        throw new CustomError(
          HttpResMsg.INVALID_PAGINATION,
          HttpResCode.BAD_REQUEST
        );
      }

      const { articles, total } = await this.articleService.getMyArticles(
        trainerId,
        pageNum,
        limitNum,
        search as string,
        sortBy as "createdAt" | "upvotes" | undefined
      );
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        articles,
        total,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 5, search, sortBy } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        throw new CustomError(
          HttpResMsg.INVALID_PAGINATION,
          HttpResCode.BAD_REQUEST
        );
      }
      const { articles, total } = await this.articleService.getAllArticles(
        pageNum,
        limitNum,
        search as string,
        sortBy as "createdAt" | "upvotes" | undefined
      );
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        articles,
        total,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      next(error);
    }
  }

  async upvoteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.decoded?.id;
      if (!userId) {
        sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
        return;
      }
      const article = await this.articleService!.toggleUpvote(
        req.params.articleId,
        userId
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, article);
    } catch (error) {
      next(error);
    }
  }

  // async getArticleById(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const article = await this.articleService!.getArticleById(req.params.id);
  //     if (!article) {
  //       sendResponse(res, HttpResCode.NOT_FOUND, HttpResMsg.NOT_FOUND);
  //       return;
  //     }
  //     sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, article);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
