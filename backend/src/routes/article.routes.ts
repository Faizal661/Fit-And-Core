import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";

import express from "express";
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
  (req, res, next) => articleController.createArticle(req, res, next)
);

router.get(
  "/all-articles",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
  (req, res, next) => articleController.getAllArticles(req, res, next)
);

export default router;
