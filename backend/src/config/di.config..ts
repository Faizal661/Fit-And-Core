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

import UserController from "../controllers/Implementation/user.controller";
import UserService from "../services/Implementation/user.service";
import { UserRepository } from "../repositories/Implementation/user.repository";
import { IUserController } from "../controllers/Interface/IUserController";
import { IUserService } from "../services/Interface/IUserService";
import { IUserRepository } from "../repositories/Interface/IUserRepository";

//
container.registerInstance('RedisClient', redisClient);

// Controllers
container.register<IAuthController>('AuthController', { useClass: AuthController });
container.register<IAdminController>('AdminController', { useClass: AdminController });
container.register<IUserController>("UserController", { useClass: UserController });


// Services
container.register<IAuthService>('AuthService', { useClass: AuthService });
container.register<IAdminService>('AdminService', { useClass: adminService });
container.register<IUserService>("UserService", { useClass: UserService });


// Repositories
container.register<IAuthRepository>('AuthRepository',{useClass: AuthRepository})
container.register<IAdminRepository>('AdminRepository',{useClass: AdminRepository})
container.register<IUserRepository>("UserRepository", { useClass: UserRepository });
