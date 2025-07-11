import "reflect-metadata";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import CustomError from "./errors/CustomError";
import {
  HttpResCode,
  HttpResMsg,
} from "./constants/http-response.constants";

// Configs
dotenv.config();
import env from "./config/env.config";
import connectDB from "./config/db.config";
import setupScheduledJobs from "./scheduler";
import configurePassport from "./config/passport";
import configureSocketIO from "./config/socket.io.config";

// Middlewares
import requestLogging from "./middlewares/request-logger.middleware";
import errorHandler from "./middlewares/error-handler.middleware";

// Routers
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import groupRoutes from "./routes/group.routes";
import reviewRoutes from "./routes/review.routes";
import streakRoutes from "./routes/streak.routes";
import reportRoutes from "./routes/report.routes";
import walletRoutes from "./routes/wallet.routes";
import trainerRoutes from "./routes/trainer.routes";
import articleRoutes from "./routes/article.routes";
import sessionRoutes from "./routes/session.routes";
import webhookRoutes  from "./routes/webHook.routes";
import foodLogsRoutes from "./routes/foodLogs.routes";
import progressRoutes from "./routes/progress.routes";
import recordingRoutes from "./routes/recording.routes";
import notificationRoutes from "./routes/notification.routes";
import subscriptionRoutes  from "./routes/subscription.routes";

const app = express();

const PORT = env.PORT || 5000;

// For handling stripe webhooks, need raw and unparsed reqeust body to verify signature.
app.use("/api/subscription", webhookRoutes);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));

//log req & res details
const loggers = requestLogging();
loggers.forEach((middleware) => app.use(middleware));

// Initialize Passport
configurePassport();
app.use(passport.initialize());

// Routers
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/streaks", streakRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/food-logs", foodLogsRoutes);
app.use("/api/recording", recordingRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);

// handling error for unknown routes
app.use((req, res, next) => {
  next(new CustomError(HttpResMsg.ROUTE_NOT_FOUND, HttpResCode.NOT_FOUND));
});

// Error handling
app.use(errorHandler);

const httpServer = configureSocketIO(app);

// Start scheduled jobs
setupScheduledJobs();

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(HttpResMsg.SERVER_CONNECTION);
  });
});
