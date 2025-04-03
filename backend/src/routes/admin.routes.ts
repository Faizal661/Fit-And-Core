import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";
import express from "express";

import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { IAdminController } from "../controllers/Interface/IAdminController";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";

const router = express.Router();
const adminController = container.resolve<IAdminController>("AdminController");

router.get(
  "/user-count",
  verifyAccessToken,
  authorizeRoles(["admin"]),
  (req, res, next) => adminController.userCount(req, res, next)
);
router.get(
  "/trainer-count",
  verifyAccessToken,
  authorizeRoles(["admin"]),
  (req, res, next) => adminController.trainerCount(req, res, next)
);
router.get(
  "/monthly-registrations-data",
  verifyAccessToken,
  authorizeRoles(["admin"]),
  (req, res, next) => adminController.getMonthlySubscriptionData(req, res, next)
);

export default router;
