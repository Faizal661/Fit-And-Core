import "reflect-metadata";
import "../config/tsyringe.config";
import { container } from "tsyringe";

import express from "express";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";

import { ISubscriptionController } from "../controllers/Interface/ISubscriptionController";

const webhookRouter = express.Router();

const subscriptionController = container.resolve<ISubscriptionController>(
  "SubscriptionController"
);

webhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  (req, res, next) => subscriptionController.handleStripeWebhook(req, res, next)
);

export default webhookRouter;
