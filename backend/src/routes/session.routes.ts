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
// const slotController = container.resolve("SlotController");

router.post(
  "/create-availability",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
  (req, res, next) => sessionController.createAvailability(req, res, next)
);

router.get(
  "/get-availability-by-date",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
  (req, res, next) =>
    sessionController.getTrainerAvailabilityByDate(req, res, next)
);

router.get(
  "/get-my-availabilities",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
  (req, res, next) =>
    sessionController.getUpcomingTrainerAvailabilities(req, res, next)
);


//slots
router.get(
  "/get-trainer-slots-by-date",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user","trainer"]),
  (req, res, next) =>
    sessionController.getTrainerSlotsByDate(req, res, next)
);


router.post(
  "/book-slot",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  (req, res, next) => sessionController.bookSlot(req, res, next)
);

//bookings 
router.get(
  "/bookings",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
  (req, res, next) =>
    sessionController.getUpcomingTrainerBookings(req, res, next)
);
router.put(
  "/trainer-cancel-booking",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["trainer"]),
  (req, res, next) =>
    sessionController.trainerCancelBooking(req, res, next)
);

router.put(
  "/user-cancel-booking",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  (req, res, next) =>
    sessionController.userCancelBooking(req, res, next)
);

router.get(
  "/user-all-bookings",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  (req, res, next) =>
    sessionController.getAllUserBookingsWithTrainer(req, res, next)
);


export default router;
