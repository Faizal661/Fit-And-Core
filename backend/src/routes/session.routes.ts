import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";

import express from "express";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { ISessionController } from "../controllers/Interface/ISessionController";

const router = express.Router();
const sessionController =
  container.resolve<ISessionController>("SessionController");

router.post(
  "/create-availability",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
  (req, res, next) => sessionController.createAvailability(req, res, next)
);

export default router;
