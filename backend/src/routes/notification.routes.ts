import { Router } from "express";
import { container } from "tsyringe";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { NotificationController } from "../controllers/Implementation/notification.controller";

const router = Router();
const notificationController = container.resolve<NotificationController>(
  "NotificationController"
);

const userAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer", "admin"]),
];

router
  .route("/:userId")
  .get(...userAccess, (req, res, next) =>
    notificationController.getNotifications(req, res, next)
  );

router.patch(
  "/:userId/:notificationId/read",
   ...userAccess,
  (req, res, next) => notificationController.markNotificationAsRead(req, res, next)
);

router.patch(
  "/:userId/read-all",
   ...userAccess,
  (req, res, next) => notificationController.markAllNotificationsAsRead(req, res, next)
);

export default router;
