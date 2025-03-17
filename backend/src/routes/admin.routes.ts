import 'reflect-metadata';
import '../config/di.config.'
import { container } from 'tsyringe';
import express from 'express';

import { verifyAccessToken } from '../middlewares/verifyToken.middleware';
import { IAdminController } from '../controllers/Interface/IAdminController';

const router = express.Router();
const adminController = container.resolve<IAdminController>("AdminController")


router.get('/user-count',verifyAccessToken,(req,res,next)=>adminController.userCount(req,res,next))
router.get('/trainer-count',verifyAccessToken,(req,res,next)=>adminController.trainerCount(req,res,next))


export default router 