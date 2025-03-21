// Packages
import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";

// Configurations
import configurePassport from "./config/passport";
import connectDB from "./config/db.config";
dotenv.config();

// Middlewares
import { errorHandler } from "mern.common";
import requestLogging from "./middlewares/request.middleware";

// Import routers
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes.ts";
import trainerRoutes from "./routes/trainer.routes.ts";

const app = express();

const PORT = process.env.PORT || 5000;



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

app.use(errorHandler); 

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server connection   ✅`)
  });
});
