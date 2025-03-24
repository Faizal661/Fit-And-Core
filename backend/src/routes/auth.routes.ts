import 'reflect-metadata';
import '../config/tsyringe.config.'
import { container } from 'tsyringe';

import { IAuthController } from '../controllers/Interface/IAuthController';

import express from 'express';
import {verifyAccessToken } from '../middlewares/verify-token.middleware';
const router = express.Router();

const authController = container.resolve<IAuthController>("AuthController")


router.post('/check-email-username',(req,res,next)=>authController.checkUsernameEmail(req,res,next))
router.post('/check-email',(req,res,next)=>authController.checkEmail(req,res,next))
router.post('/verify-otp',(req,res,next)=>authController.verifyOtp(req,res,next))
router.post('/resend-otp',(req,res,next)=>authController.resendOtp(req,res,next))
router.post('/register',(req,res,next)=>authController.register(req,res,next))
router.post('/login',(req,res,next)=>authController.login(req,res,next))
router.post('/reset-password',(req,res,next)=>authController.updatePassword(req,res,next))

router.post('/logout',verifyAccessToken,(req,res,next)=>authController.logout(req,res,next))

// Google OAuth routes
router.get('/google', authController.googleAuth.bind(authController));
router.get('/google/callback', authController.googleCallback.bind(authController));
router.post('/google/verify', authController.verifyGoogleToken.bind(authController));


export default router 