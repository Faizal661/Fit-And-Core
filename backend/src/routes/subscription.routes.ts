import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";

import express from "express";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";

import { ISubscriptionController } from "../controllers/Interface/ISubscriptionController";

const router = express.Router();

const subscriptionController = container.resolve<ISubscriptionController>(
  "SubscriptionController"
);

router.post(
  "/create-checkout-session",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  (req, res, next) =>
    subscriptionController.createCheckoutSession(req, res, next)
);

router.get(
  "/verify-payment",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  (req, res, next) => subscriptionController.verifyPayment(req, res, next)
);


router.get(
  "/check",
  verifyAccessToken,
  authorizeRoles(["user"]),
  (req, res, next) => subscriptionController.checkStatus(req, res, next)
);

router.patch(
  "/:subscriptionId/refund",
  verifyAccessToken,
  authorizeRoles(["trainer","admin"]),
  (req, res, next) => subscriptionController.refundSubscription(req, res, next)
);


router.get(
  "/history",
  verifyAccessToken,
  authorizeRoles(["user"]),
  (req, res, next) => subscriptionController.getAllUserSubscriptions(req, res, next)
);



export default router;

