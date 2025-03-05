import 'reflect-metadata';
import '../config/container.tsyringe'

import express from 'express';
const router = express.Router();

import { IAuthenticationController } from '../controllers/Interface/IAuthenticationController';

import { container } from 'tsyringe';



const authenticationController = container.resolve<IAuthenticationController>("AuthenticationController")



router.post('/check-email-username',(req,res,next)=>authenticationController.checkUsernameEmail(req,res,next))

export default router 