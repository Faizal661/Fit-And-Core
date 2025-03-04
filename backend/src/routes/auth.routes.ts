import 'reflect-metadata';
import express from 'express';
import { container } from 'tsyringe';
import { IAuthenticationController } from '../controllers/Interface/IAuthenticationController';


const authenticationController = container.resolve<IAuthenticationController>('AuthenticationController');

const router = express.Router();

router.post('/check-email-username',(req,res,next)=>authenticationController.checkUsernameEmail(req,res,next))

export default router 