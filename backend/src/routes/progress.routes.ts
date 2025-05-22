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

const userTrainerAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"]),
];

router
  .route("/:traineeId")
  .get(...userTrainerAccess, (req, res, next) =>
    progressController.getMyProgressions(req, res, next)
  )
  .post(...userTrainerAccess, (req, res, next) =>
    progressController.addNewProgress(req, res, next)
  );

export default router;
