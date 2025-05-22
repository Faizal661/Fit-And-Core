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
const articleController = container.resolve<IArticleController>("ArticleController");

const trainerAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"])
];

const userTrainerAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"])
];

const userAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"])
];

const trainerAdminAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer", "admin"])
];

const uploadThumbnail = upload.single("thumbnail");

// Base path: /api/articles


// Article collection routes
router.route('/')
  .post(
    ...trainerAccess,
    uploadThumbnail,
    (req, res, next) => articleController.createArticle(req, res, next)
  )
  .get(
    ...userAccess,
    (req, res, next) => articleController.getAllArticles(req, res, next)
  );

// My articles 
router.route('/mine')
  .get(
    ...trainerAccess,
    (req, res, next) => articleController.getMyArticles(req, res, next)
  );

// Specific article routes
router.route('/:articleId')
  .get(
    ...userTrainerAccess,
    (req, res, next) => articleController.getArticleById(req, res, next)
  )
  .patch(
    ...trainerAccess,
    uploadThumbnail,
    (req, res, next) => articleController.updateArticle(req, res, next)
  )
  .delete(
    ...trainerAdminAccess,
    (req, res, next) => articleController.deleteArticle(req, res, next)
  );

// Article interactions (upvote)
router.route('/:articleId/upvotes')
  .post(
    ...userTrainerAccess,
    (req, res, next) => articleController.upvoteArticle(req, res, next)
  )
  .get(
    ...userTrainerAccess,
    (req, res, next) => articleController.getUpvotersByArticle(req, res, next)
  );

export default router;