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

// Middleware groups
const userAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user"]),
];

const adminAccess = [verifyAccessToken, authorizeRoles(["admin"])];

const trainerAccess = [verifyAccessToken, authorizeRoles(["trainer"])];

const userAdminAccess = [verifyAccessToken, authorizeRoles(["user", "admin"])];

const uploadTrainerDocs = upload.fields([
  { name: "documentProofs", maxCount: 3 },
  { name: "certifications", maxCount: 5 },
  { name: "achievements", maxCount: 5 },
]);

// Trainer Applications
router
  .route("/applications")
  .post(...userAccess, uploadTrainerDocs, (req, res, next) =>
    trainerController.applyTrainer(req as CustomRequest, res, next)
  )
  .get(...adminAccess, (req, res, next) =>
    trainerController.getTrainerApplications(req, res, next)
  );

router
  .route("/applications/status")
  .get(...userAccess, (req, res, next) =>
    trainerController.getApplicationStatus(req, res, next)
  );

router
  .route("/applications/:trainerId/approval")
  .patch(...adminAccess, (req, res, next) =>
    trainerController.approveTrainer(req, res, next)
  )

router
  .route("/applications/:trainerId/reject")
  .patch(...adminAccess, (req, res, next) =>
    trainerController.rejectTrainer(req, res, next)
  );

// Trainer Directory
router
  .route("/approved")
  .get(...userAccess, (req, res, next) =>
    trainerController.getApprovedTrainers(req, res, next)
  );

// Trainer Relationships
router
  .route("/subscriptions/:userId")
  .get(...userAdminAccess, (req, res, next) =>
    trainerController.subscribedTrainersDetails(req, res, next)
  );

router
  .route("/trainees")
  .get(...trainerAccess, (req, res, next) =>
    trainerController.getMyTrainees(req, res, next)
  );

router
  .route("/trainees/:traineeId")
  .get(...trainerAccess, (req, res, next) =>
    trainerController.getTraineeDetails(req, res, next)
  );

// Trainer Profiles
router
  .route("/:trainerId")
  .get(...userAdminAccess, (req, res, next) =>
    trainerController.getOneTrainerDetails(req, res, next)
  );



export default router;
