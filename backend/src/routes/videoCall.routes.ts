import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";

import express from "express";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { VideoCallController  } from "../controllers/Implementation/video-call.controller";

const router = express.Router();
const videoCallController = container.resolve(VideoCallController);

const userTrainerAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"]),
];

router
  .route("/")
  .get(...userTrainerAccess, (req, res, next) =>
    videoCallController.getIceServers(req, res, next)
  )


export default router;
