// Packages
import "reflect-metadata";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import { CustomError } from "./errors/CustomError.ts";
import { HttpResCode } from "./constants/Response.constants.ts";

// Configurations
dotenv.config();
import connectDB from "./config/db.config";
import configurePassport from "./config/passport";

// Middlewares
import requestLogging from "./middlewares/request-logger.middleware.ts";
import { errorHandler } from "./middlewares/error-handler.middleware.ts"; 

// Import routers
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes.ts";
import trainerRoutes from "./routes/trainer.routes.ts";


const app = express();

const PORT = process.env.PORT || 5000;

// 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

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

// Error handling middlewares
app.use((req, res, next) => {
  next(new CustomError(`Route ${req.originalUrl} not found`,HttpResCode.NOT_FOUND));
});
app.use(errorHandler); 

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server connection   ✅`)
  });
});
