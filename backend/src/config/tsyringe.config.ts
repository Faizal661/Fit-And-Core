import "reflect-metadata";
import { container } from "tsyringe";

import redisClient from "./redis.config";

import AuthController from "../controllers/Implementation/auth.controller";
import AuthService from '../services/Implementation/auth.service';
import { IAuthRepository } from "../repositories/Interface/IAuthRepository";
import { IAuthController } from '../controllers/Interface/IAuthController'
import { IAuthService } from '../services/Interface/IAuthService';
import { AuthRepository } from "../repositories/Implementation/auth.repository";

import AdminService from "../services/Implementation/admin.service";
import AdminController from "../controllers/Implementation/admin.controller";
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

import TrainerService from "../services/Implementation/trainer.service";
import TrainerController from "../controllers/Implementation/trainer.controller";
import {TrainerRepository} from "../repositories/Implementation/trainer.repository";
import { ITrainerRepository } from "../repositories/Interface/ITrainerRepository";
import { ITrainerService } from "../services/Interface/ITrainerService";
import { ITrainerController } from "../controllers/Interface/ITrainerController";

import ArticleService from "../services/Implementation/article.service";
import { ArticleController } from "../controllers/Implementation/article.controller";
import { ArticleRepository } from "../repositories/Implementation/article.repository";
import { IArticleController } from "../controllers/Interface/IArticleController";
import { IArticleRepository } from "../repositories/Interface/IArticleRepository";
import { IArticleService } from "../services/Interface/IArticleService";

import SubscriptionService from "../services/Implementation/subscription.service";
import { SubscriptionController } from "../controllers/Implementation/subscription.controller";
import { SubscriptionRepository } from "../repositories/Implementation/subscription.repository";
import { ISubscriptionController } from "../controllers/Interface/ISubscriptionController";
import { ISubscriptionService } from "../services/Interface/ISubscriptionService";
import { ISubscriptionRepository } from "../repositories/Interface/ISubscriptionRepository";

import { SessionController } from "../controllers/Implementation/session.controller";
import { ISessionController } from "../controllers/Interface/ISessionController";
import { IAvailabilityRepository } from "../repositories/Interface/IAvailabilityRepository";
import { AvailabilityRepository } from "../repositories/Implementation/availability.repository";
import { ISlotRepository } from "../repositories/Interface/ISlotRepository";
import { SlotRepository } from "../repositories/Implementation/slot.repository";
import SessionService from "../services/Implementation/session.service";
import { ISessionService } from "../services/Interface/ISessionService";

container.registerInstance('RedisClient', redisClient);

container.register<IAuthController>('AuthController', { useClass: AuthController });
container.register<IAuthService>('AuthService', { useClass: AuthService });
container.register<IAuthRepository>('AuthRepository',{useClass: AuthRepository})

container.register<IAdminController>('AdminController', { useClass: AdminController });
container.register<IAdminRepository>('AdminRepository',{useClass: AdminRepository})
container.register<IAdminService>('AdminService', { useClass: AdminService });

container.register<IUserController>("UserController", { useClass: UserController });
container.register<IUserService>("UserService", { useClass: UserService });
container.register<IUserRepository>("UserRepository", { useClass: UserRepository });

container.register<ITrainerController>("TrainerController", { useClass: TrainerController,});
container.register<ITrainerService>("TrainerService", { useClass: TrainerService,});
container.register<ITrainerRepository>("TrainerRepository", { useClass: TrainerRepository,});

container.register<IArticleController>("ArticleController", { useClass: ArticleController,});
container.register<IArticleService>("ArticleService", { useClass: ArticleService,});
container.register<IArticleRepository>("ArticleRepository", { useClass: ArticleRepository,});

container.register<ISubscriptionController>("SubscriptionController", { useClass: SubscriptionController,});
container.register<ISubscriptionService>("SubscriptionService", { useClass: SubscriptionService,});
container.register<ISubscriptionRepository>("SubscriptionRepository", { useClass: SubscriptionRepository,});

container.register<ISessionController>("SessionController", { useClass: SessionController,});
container.register<ISessionService>("SessionService", { useClass: SessionService,});
container.register<IAvailabilityRepository>("AvailabilityRepository", { useClass: AvailabilityRepository,});
container.register<ISlotRepository>("SlotRepository", { useClass: SlotRepository,});
// container.register<IBookingRepository>("BookingRepository", { useClass: BookingRepository,});