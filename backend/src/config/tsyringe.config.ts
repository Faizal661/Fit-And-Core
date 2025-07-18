import "reflect-metadata";
import { container } from "tsyringe";

import redisClient from "./redis.config";
import { Server } from 'socket.io';

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
import { BookingRepository } from "../repositories/Implementation/booking.repository";
import { IBookingRepository } from "../repositories/Interface/IBookingRepository";

import { ProgressController } from "../controllers/Implementation/progress.controller";
import ProgressService from "../services/Implementation/progress.service";
import { ProgressRepository } from "../repositories/Implementation/progress.repository";
import { IProgressController } from "../controllers/Interface/IProgressController";
import { IProgressService } from "../services/Interface/IProgressService";
import { IProgressRepository } from "../repositories/Interface/IProgressRepository";

import { FoodLogController } from "../controllers/Implementation/foodLog.controller";
import FoodLogService from "../services/Implementation/foodLog.service";
import { FoodLogRepository } from "../repositories/Implementation/foodLog.respository";
import { IFoodLogController } from "../controllers/Interface/IFoodLogController";
import { IFoodLogService } from "../services/Interface/IFoodLogService";
import { IFoodLogRepository } from "../repositories/Interface/IFoodLogRepository";
import { IGeminiService } from "../services/Interface/IGeminiApiService";
import { GeminiService } from "../services/Implementation/geminiApi.service";

import { VideoSessionRepository } from '../repositories/Implementation/video-session.repository';
import { VideoCallService } from '../services/Implementation/video-call.service';
import { IVideoCallService } from "../services/Interface/IVideoCallService";
import { IVideoSessionRepository } from "../repositories/Interface/IVideoSessionRepository";

import { RecordingController } from "../controllers/Implementation/recording.controller";
import { RecordingService } from "../services/Implementation/recording.service";
import { IRecordingController } from "../controllers/Interface/IRecordingController";
import { IRecordingService } from "../services/Interface/IRecordingService";

import { IReportController } from "../controllers/Interface/IReportController";
import { ReportController } from "../controllers/Implementation/report.controller";
import { ReportService } from "../services/Implementation/report.service";
import { ReportRepository } from "../repositories/Implementation/report.repository";
import { IReportRepository } from "../repositories/Interface/IReportRepository";
import { IReportService } from "../services/Interface/IReportService";

import { NotificationRepository } from '../repositories/Implementation/notification.repository';
import { NotificationService } from '../services/Implementation/notification.service';
import { NotificationController } from "../controllers/Implementation/notification.controller";
import { INotificationRepository } from "../repositories/Interface/INotificationRepository";
import { INotificationService } from "../services/Interface/INotificationService";
import { INotificationController } from "../controllers/Interface/INotificationController";

import { StreakRepository } from "../repositories/Implementation/streak.repository";
import { StreakService } from "../services/Implementation/streak.service";
import { StreakController } from "../controllers/Implementation/streak.controller";
import { IStreakRepository } from "../repositories/Interface/IStreakRepository";
import { IStreakService } from "../services/Interface/IStreakService";
import { IStreakController } from "../controllers/Interface/IStreakController";

import { GroupRepository } from "../repositories/Implementation/community/group.repository";
import { GroupMemberRepository } from "../repositories/Implementation/community/group-member.repository";
import { GroupService } from "../services/Implementation/group.service";
import { GroupController } from "../controllers/Implementation/group.controller";
import { MessageRepository } from "../repositories/Implementation/community/message.repository";

import { WalletRepository } from "../repositories/Implementation/wallet.repository";
import { WalletService } from "../services/Implementation/wallet.service";
import { WalletController } from "../controllers/Implementation/wallet.controller";

import { IReviewController } from "../controllers/Interface/IReviewController";
import { IReviewService } from "../services/Interface/IReviewService";
import { IReviewRepository } from "../repositories/Interface/IReviewRepository";
import { ReviewController } from "../controllers/Implementation/review.controller";
import { ReviewService } from "../services/Implementation/review.service";
import { ReviewRepository } from "../repositories/Implementation/review.repository";

container.registerInstance('RedisClient', redisClient);
container.registerInstance('SocketIOServer', Server);

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
container.register<IBookingRepository>("BookingRepository", { useClass: BookingRepository,});

container.register<IVideoCallService>('VideoCallService', {useClass: VideoCallService});
container.register<IVideoSessionRepository>('VideoSessionRepository', {useClass: VideoSessionRepository});

container.register<IRecordingController>("RecordingController",{useClass: RecordingController})
container.register<IRecordingService>("RecordingService",{useClass: RecordingService})

container.register<IProgressController>("ProgressController", { useClass: ProgressController });
container.register<IProgressService>("ProgressService", { useClass: ProgressService });
container.register<IProgressRepository>("ProgressRepository", { useClass: ProgressRepository });

container.register<IFoodLogController>("FoodLogController", { useClass: FoodLogController });
container.register<IFoodLogService>("FoodLogService", { useClass: FoodLogService });
container.register<IFoodLogRepository>("FoodLogRepository", { useClass: FoodLogRepository });
container.register<IGeminiService>("GeminiService", { useClass: GeminiService });

container.register<IReportController>("ReportController", { useClass: ReportController });
container.register<IReportService>("ReportService", { useClass: ReportService });
container.register<IReportRepository>("ReportRepository", { useClass: ReportRepository });  

container.register<INotificationRepository>('NotificationRepository', { useClass: NotificationRepository});
container.register<INotificationService>('NotificationService', { useClass: NotificationService });
container.register<INotificationController>('NotificationController', { useClass: NotificationController });

container.register<IStreakRepository>('StreakRepository', { useClass: StreakRepository });
container.register<IStreakService>('StreakService', { useClass: StreakService });
container.register<IStreakController>('StreakController', { useClass: StreakController });


container.register<GroupRepository>('GroupRepository', { useClass: GroupRepository });
container.register<GroupMemberRepository>('GroupMemberRepository', { useClass: GroupMemberRepository });
container.register<GroupService>('GroupService', { useClass: GroupService });
container.register<GroupController>('GroupController', { useClass: GroupController });
container.register<MessageRepository>('MessageRepository', { useClass: MessageRepository });

container.register<WalletRepository>('WalletRepository', { useClass: WalletRepository });
container.register<WalletService>('WalletService', { useClass: WalletService });
container.register<WalletController>('WalletController', { useClass: WalletController });

container.register<IReviewController>("ReviewController", { useClass: ReviewController });
container.register<IReviewService>("ReviewService", { useClass: ReviewService });
container.register<IReviewRepository>("ReviewRepository", { useClass: ReviewRepository });  