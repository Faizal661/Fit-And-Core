import 'reflect-metadata';
import '../config/di.config.'
import { container } from 'tsyringe';

import { IAuthenticationController } from '../controllers/Interface/IAuthenticationController';

import express from 'express';
const router = express.Router();

const authenticationController = container.resolve<IAuthenticationController>("AuthenticationController")


router.post('/check-email-username',(req,res,next)=>authenticationController.checkUsernameEmail(req,res,next))
router.post('/verify-otp',(req,res,next)=>authenticationController.verifyOtp(req,res,next))

export default router 