// Packages
import "reflect-metadata";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import { CustomError } from "./errors/CustomError.ts";
import {
  HttpResCode,
  HttpResMsg,
} from "./constants/http-response.constants.ts";

// Configurations
dotenv.config();
import connectDB from "./config/db.config";
import configurePassport from "./config/passport";
import { env } from "./config/env.config.ts";
import { configureSocketIO } from "./config/socket.io.config";
import { setupScheduledJobs } from "./scheduler";

// Middlewares
import requestLogging from "./middlewares/request-logger.middleware.ts";
import { errorHandler } from "./middlewares/error-handler.middleware.ts";

// Import routers
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes.ts";
import trainerRoutes from "./routes/trainer.routes.ts";
import articleRoutes from "./routes/article.routes.ts";
import sessionRoutes from "./routes/session.routes.ts";
import {
  subscriptionRoutes,
  webhookRoutes,
} from "./routes/subscription.routes.ts";
import progressRoutes from "./routes/progress.routes.ts";
import foodLogsRoutes from "./routes/foodLogs.routes.ts";
import recordingRoutes from "./routes/recording.routes.ts";
import reportRoutes from "./routes/report.routes.ts";
import notificationRoutes from "./routes/notification.routes.ts";

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
app.use("/api/trainer", trainerRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/food-logs", foodLogsRoutes);
app.use("/api/recording", recordingRoutes);
app.use("/api/reports", reportRoutes);
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
