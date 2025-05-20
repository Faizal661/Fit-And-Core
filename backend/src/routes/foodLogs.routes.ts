import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";

import express from "express";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { IFoodLogController } from "../controllers/Interface/IFoodLogController";

const router = express.Router();
const foodLogController =
  container.resolve<IFoodLogController>("FoodLogController");

router.get(
  "/:traineeId",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user","trainer"]),
  (req, res, next) => foodLogController.getFoodLogsByDate(req, res, next)
);

router.get(
  "/:traineeId/dates",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user","trainer"]),
  (req, res, next) => foodLogController.getFoodLogDatesByMonth(req, res, next)
);

router.post(
  "/",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  (req, res, next) => foodLogController.createFoodLog(req, res, next)
);


export default router;