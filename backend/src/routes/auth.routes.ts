import 'reflect-metadata';
import '../config/di.config.'
import { container } from 'tsyringe';

import { IAuthController } from '../controllers/Interface/IAuthController';

import express from 'express';
import { verifyRefreshToken, verifyAccessToken } from '../middlewares/verifyToken.middleware';
const router = express.Router();

const authController = container.resolve<IAuthController>("AuthController")


router.post('/check-email-username',(req,res,next)=>authController.checkUsernameEmail(req,res,next))
router.post('/verify-otp',(req,res,next)=>authController.verifyOtp(req,res,next))
router.post('/resend-otp',(req,res,next)=>authController.resendOtp(req,res,next))
router.post('/register',(req,res,next)=>authController.register(req,res,next))
router.post('/login',(req,res,next)=>authController.login(req,res,next))

router.post('/logout',verifyAccessToken,(req,res,next)=>authController.logout(req,res,next))

router.post('/refresh-token',verifyRefreshToken,(req,res,next)=>authController.refreshToken(req,res,next))

export default router 