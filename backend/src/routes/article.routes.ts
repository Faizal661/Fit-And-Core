import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";

import express from "express";
import { upload } from "../utils/multer.util";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { IArticleController } from "../controllers/Interface/IArticleController";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";

const router = express.Router();
const articleController =
  container.resolve<IArticleController>("ArticleController");

router.post(
  "/create-article",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
  upload.single("thumbnail"),
  (req, res, next) => articleController.createArticle(req, res, next)
);

router.get(
  "/my-articles",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
  (req, res, next) => articleController.getMyArticles(req, res, next)
);

router.get(
  "/all-articles",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  (req, res, next) => articleController.getAllArticles(req, res, next)
);

router.post(
  "/:articleId/upvote",
  verifyAccessToken,
  authorizeRoles(["user","trainer"]),
  (req, res, next) => articleController.upvoteArticle(req, res, next)
);

router.get(
  "/:articleId",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user","trainer"]),
  (req, res, next) => articleController.getArticleById(req, res, next)
);

router.patch(
  "/update-article/:articleId",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
  upload.single("thumbnail"),
  (req, res, next) => articleController.updateArticle(req, res, next)
);

router.get(
  "/:articleId/upvoters",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user","trainer"]),
  (req, res, next) => articleController.getUpvotersByArticle(req, res, next)
);

router.delete(
  '/:articleId', 
  verifyAccessToken, 
  checkBlockedUser,
  authorizeRoles(['trainer', 'admin']),
  (req, res, next) => articleController.deleteArticle(req, res, next)
);

export default router;
