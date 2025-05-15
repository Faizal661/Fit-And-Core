import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";

import express from "express";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { IProgressController } from "../controllers/Interface/IProgressController";

const router = express.Router();
const progressController =
  container.resolve<IProgressController>("ProgressController");

router.get(
  "/my-progressions",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  (req, res, next) => progressController.getMyProgressions(req, res, next)
);

router.post(
  "/new-progress",
  verifyAccessToken,
  authorizeRoles(["user","trainer"]),
  (req, res, next) => progressController.addNewProgress(req, res, next)
);


export default router;