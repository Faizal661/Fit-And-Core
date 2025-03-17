import "reflect-metadata";
import { container } from "tsyringe";

import redisClient from "./redis.config";

import AuthController from "../controllers/Implementation/auth.controller";
import AuthService from '../services/Implementation/auth.service';
import { IAuthRepository } from "../repositories/Interface/IAuthRepository";
import { IAuthController } from '../controllers/Interface/IAuthController'
import { IAuthService } from '../services/Interface/IAuthService';
import { AuthRepository } from "../repositories/Implementation/auth.repository";


import AdminController from "../controllers/Implementation/admin.controller";
import adminService from "../services/Implementation/admin.service";
import { AdminRepository } from "../repositories/Implementation/admin.repository";
import { IAdminController } from "../controllers/Interface/IAdminController";
import { IAdminService } from "../services/Interface/IAdminService";
import { IAdminRepository } from "../repositories/Interface/IAdminRepository";


//
container.registerInstance('RedisClient', redisClient);

// Controllers
container.register<IAuthController>('AuthController', { useClass: AuthController });
container.register<IAdminController>('AdminController', { useClass: AdminController });


// Services
container.register<IAuthService>('AuthService', { useClass: AuthService });
container.register<IAdminService>('AdminService', { useClass: adminService });


// Repositories
container.register<IAuthRepository>('AuthRepository',{useClass: AuthRepository})
container.register<IAdminRepository>('AdminRepository',{useClass: AdminRepository})
