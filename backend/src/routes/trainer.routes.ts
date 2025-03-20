import express from "express";
import { container } from "tsyringe";
import { ITrainerController } from "../controllers/Interface/ITrainerController";
import { verifyAccessToken } from '../middlewares/verifyToken.middleware';
import { CustomRequest } from "../types/trainer.types";
import { upload } from "../utils/multer.util";

const router = express.Router();
const trainerController = container.resolve<ITrainerController>("TrainerController");


router.post(
  "/apply-trainer", 
  verifyAccessToken,
  upload.fields([
    { name: 'documentProofs', maxCount: 3 },
    { name: 'certifications', maxCount: 5 },
    { name: 'achievements', maxCount: 5 }
  ]), 
  (req, res, next) => trainerController.applyTrainer(req as CustomRequest, res, next)
);

// router.get(
//   "/trainer-applications",
//   verifyAccessToken,
//   (req, res, next) => trainerController.getTrainerApplications(req, res, next)
// );

// router.put(
//   "/approve-trainer/:trainerId",
//   verifyAccessToken,
//   (req, res, next) => trainerController.approveTrainer(req, res, next)
// );

export default router;