import 'reflect-metadata';
import '../config/tsyringe.config.'
import { container } from "tsyringe";

import { IUserController } from "../controllers/Interface/IUserController";
import { verifyAccessToken } from '../middlewares/verify-token.middleware';
import { authorizeRoles } from '../middlewares/role-based-access-control.middleware';

import express from "express";
import { upload } from '../utils/multer.util';
const router = express.Router();
const userController = container.resolve<IUserController>("UserController");

router.get("/profile", verifyAccessToken, authorizeRoles(["user", "trainer"]),(req, res, next) => 
  userController.getUserProfile(req, res, next)
);

router.put("/profile", verifyAccessToken, authorizeRoles(["user","trainer"]),(req, res, next) => 
  userController.updateUserProfile(req, res, next)
);

router.put("/profile-picture", verifyAccessToken,authorizeRoles(["user", "trainer"]), upload.single('profilePicture'), (req, res, next) => 
  userController.updateProfilePicture(req, res, next)
);

router.put('/change-password',verifyAccessToken,authorizeRoles(["user", "trainer"]),(req,res,next)=>userController.changePassword(req,res,next))


export default router;