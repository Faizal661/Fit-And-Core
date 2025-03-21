import 'reflect-metadata';
import '../config/tsyringe.config.'
import { container } from "tsyringe";

import { IUserController } from "../controllers/Interface/IUserController";
import { verifyAccessToken } from '../middlewares/verify-token.middleware';

import express from "express";
import { upload } from '../utils/multer.util';
const router = express.Router();
const userController = container.resolve<IUserController>("UserController");

router.get("/profile", verifyAccessToken, (req, res, next) => 
  userController.getUserProfile(req, res, next)
);

router.put("/profile", verifyAccessToken, (req, res, next) => 
  userController.updateUserProfile(req, res, next)
);

router.put("/profile-picture", verifyAccessToken, upload.single('profilePicture'), (req, res, next) => 
  userController.updateProfilePicture(req, res, next)
);

export default router;