import express from "express";
import { container } from "tsyringe";
import { ITrainerController } from "../controllers/Interface/ITrainerController";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { CustomRequest } from "../types/trainer.types";
import { upload } from "../utils/multer.util";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";

const router = express.Router();
const trainerController =
  container.resolve<ITrainerController>("TrainerController");

router.post(
  "/apply-trainer",
  verifyAccessToken,
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

export default router;
