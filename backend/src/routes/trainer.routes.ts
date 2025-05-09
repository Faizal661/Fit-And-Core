import express from "express";
import { container } from "tsyringe";
import { ITrainerController } from "../controllers/Interface/ITrainerController";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { CustomRequest } from "../types/trainer.types";
import { upload } from "../utils/multer.util";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";

const router = express.Router();
const trainerController =
  container.resolve<ITrainerController>("TrainerController");

// trainer apply
router.post(
  "/apply-trainer",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  upload.fields([
    { name: "documentProofs", maxCount: 3 },
    { name: "certifications", maxCount: 5 },
    { name: "achievements", maxCount: 5 },
  ]),
  (req, res, next) =>
    trainerController.applyTrainer(req as CustomRequest, res, next)
);

router.get(
  "/application/status",
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
  (req, res, next) => trainerController.getApplicationStatus(req, res, next)
);

router.get(
  "/trainer-applications",
  verifyAccessToken,
  authorizeRoles(["admin"]),
  (req, res, next) => trainerController.getTrainerApplications(req, res, next)
);

router.put(
  "/:trainerId/approve",
  verifyAccessToken,
  authorizeRoles(["admin"]),
  (req, res, next) => trainerController.approveTrainer(req, res, next)
);

router.put(
  "/:trainerId/reject",
  verifyAccessToken,
  authorizeRoles(["admin"]),
  (req, res, next) => trainerController.rejectTrainer(req, res, next)
);


// 
router.get(
  "/trainer-approved",
  verifyAccessToken,
  authorizeRoles(["user"]),
  (req, res, next) => trainerController.getApprovedTrainers(req, res, next)
);

router.get(
  "/:trainerId",
  verifyAccessToken,
  authorizeRoles(["admin", "user"]),
  (req, res, next) => trainerController.getOneTrainerDetails(req, res, next)
);

router.get(
  "/subscribed/:userId",
  verifyAccessToken,
  authorizeRoles(["admin", "user"]),
  (req, res, next) =>
    trainerController.subscribedTrainersDetails(req, res, next)
);

export default router;
