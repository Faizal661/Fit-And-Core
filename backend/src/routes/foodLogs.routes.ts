import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";

import express from "express";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { IFoodLogController } from "../controllers/Interface/IFoodLogController";

const router = express.Router();
const foodLogController = container.resolve<IFoodLogController>("FoodLogController");

const userTrainerAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"])
];

const userOnlyAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"])
];

// Base path: /api/food-logs

router.route('/')
  .post(
    ...userOnlyAccess,
    (req, res, next) => foodLogController.createFoodLog(req, res, next)
  );

router.route('/trainee/:traineeId')
  .get(
    ...userTrainerAccess,
    (req, res, next) => foodLogController.getFoodLogsByDate(req, res, next)
  );

router.route('/trainee/:traineeId/dates')
  .get(
    ...userTrainerAccess,
    (req, res, next) => foodLogController.getFoodLogDatesByMonth(req, res, next)
  );

router.route('/:foodLogId')
  .delete(
    ...userOnlyAccess,
    (req, res, next) => foodLogController.deleteFoodLog(req, res, next)
  );

export default router;