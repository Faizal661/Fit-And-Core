import 'reflect-metadata';
import '../config/di.config.'
import { container } from "tsyringe";

import { IUserController } from "../controllers/Interface/IUserController";
import { verifyAccessToken } from '../middlewares/verifyToken.middleware';

import express from "express";
const router = express.Router();
const userController = container.resolve<IUserController>("UserController");

router.get("/profile", verifyAccessToken, (req, res, next) => 
  userController.getUserProfile(req, res, next)
);

router.put("/profile", verifyAccessToken, (req, res, next) => 
  userController.updateUserProfile(req, res, next)
);

export default router;