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

// Middleware groups
const trainerAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
];

const userAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
];

const userTrainerAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"]),
];

// Availability Routes
router
  .route("/availabilities")
  .post(...trainerAccess, (req, res, next) =>
    sessionController.createAvailability(req, res, next)
  )
  .get(...trainerAccess, (req, res, next) =>
    sessionController.getUpcomingTrainerAvailabilities(req, res, next)
  );

router.get("/availabilities/by-date", ...trainerAccess, (req, res, next) =>
  sessionController.getTrainerAvailabilityByDate(req, res, next)
);

// slots Routes
router
  .route("/slots/by-date")
  .get(...userTrainerAccess, (req, res, next) =>
    sessionController.getTrainerSlotsByDate(req, res, next)
  );

router
  .route("/slots/book")
  .post(...userAccess, (req, res, next) =>
    sessionController.bookSlot(req, res, next)
  );

router
  .route("/slots/cancel")
  .patch(...trainerAccess, (req, res, next) =>
    sessionController.cancelAvailableSlot(req, res, next)
  );

// Bookings Routes
router
  .route("/bookings")
  .get(...trainerAccess, (req, res, next) =>
    sessionController.getUpcomingTrainerBookings(req, res, next)
  );

router
  .route("/bookings/user")
  .get(...userAccess, (req, res, next) =>
    sessionController.getAllUserBookingsWithTrainer(req, res, next)
  );

router
  .route("/bookings/trainer/cancel")
  .patch(...trainerAccess, (req, res, next) =>
    sessionController.trainerCancelBooking(req, res, next)
  );

router
  .route("/bookings/user/cancel")
  .patch(...userAccess, (req, res, next) =>
    sessionController.userCancelBooking(req, res, next)
  );

export default router;
