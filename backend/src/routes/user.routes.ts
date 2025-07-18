import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";

import { upload } from "../utils/multer.util";
import { IUserController } from "../controllers/Interface/IUserController";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";

import express from "express";
const router = express.Router();
const userController = container.resolve<IUserController>("UserController");

const profileMiddlewares = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"]),
];

const adminUserMiddlewares = [verifyAccessToken, authorizeRoles(["admin"])];

router
  .route("/profile")
  .get(...profileMiddlewares, (req, res, next) =>
    userController.getUserProfile(req, res, next)
  )
  .put(...profileMiddlewares, (req, res, next) =>
    userController.updateUserProfile(req, res, next)
  );

router
  .route("/profile-picture")
  .patch(
    ...profileMiddlewares,
    upload.single("profilePicture"),
    (req, res, next) => userController.updateProfilePicture(req, res, next)
  );

router
  .route("/change-password")
  .put(...profileMiddlewares, (req, res, next) =>
    userController.changePassword(req, res, next)
  );

router
  .route("/users")
  .get(...adminUserMiddlewares, (req, res, next) =>
    userController.getUsers(req, res, next)
  );

router
  .route("/:userId/block")
  .patch(...adminUserMiddlewares, (req, res, next) =>
    userController.toggleBlockStatus(req, res, next)
  );

export default router;
