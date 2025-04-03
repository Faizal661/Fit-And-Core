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

router.get(
  "/profile",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"]),
  (req, res, next) => userController.getUserProfile(req, res, next)
);

router.put(
  "/profile",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"]),
  (req, res, next) => userController.updateUserProfile(req, res, next)
);

router.put(
  "/profile-picture",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"]),
  upload.single("profilePicture"),
  (req, res, next) => userController.updateProfilePicture(req, res, next)
);

router.put(
  "/change-password",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"]),
  (req, res, next) => userController.changePassword(req, res, next)
);

router.get(
  "/users",
  verifyAccessToken,
  authorizeRoles(["admin"]),
  (req, res, next) => userController.getUsers(req, res, next)
);

router.patch(
  "/:userId/block",
  verifyAccessToken,
  authorizeRoles(["admin"]),
  (req, res, next) => userController.toggleBlockStatus(req, res, next)
);

export default router;
