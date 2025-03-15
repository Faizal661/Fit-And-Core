import "reflect-metadata";
import { container } from "tsyringe";

import redisClient from "./redis.config";

import { IAuthController } from '../controllers/Interface/IAuthController'
import AuthController from "../controllers/Implementation/auth.controller";
import { IAuthService } from '../services/Interface/IAuthService';
import AuthService from '../services/Implementation/auth.service';
import { IAuthRepository } from "../repositories/Interface/IAuthRepository";
import { AuthRepository } from "../repositories/Implementation/auth.repository";


//
container.registerInstance('RedisClient', redisClient);

// Controllers
container.register<IAuthController>('AuthController', { useClass: AuthController });


// Services
container.register<IAuthService>('AuthService', { useClass: AuthService });


// Repositories
container.register<IAuthRepository>('AuthRepository',{useClass: AuthRepository})
