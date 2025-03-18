// Packages
import "reflect-metadata";
import express, { NextFunction, response } from "express";
import cookieParser from 'cookie-parser'
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";

// Import routers
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes"
import userRoutes from "./routes/user.routes.ts";
import trainerRoutes from "./routes/trainer.routes.ts";

// Configurations
import configurePassport from "./config/passport";
import connectDB from "./config/db.config";
dotenv.config();

// Middlewares
import requestLogging from "./middlewares/request.middleware";
import { errorHandler } from "mern.common";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//log req & res details
const loggers = requestLogging();
loggers.forEach(middleware => app.use(middleware));


// Initialize Passport
app.use(passport.initialize());
configurePassport();
 
// Routers
app.use("/api/auth", authRoutes); 
app.use("/api/admin", adminRoutes); 
app.use("/api/user", userRoutes);
app.use("/api/trainer",trainerRoutes)

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server connection   ✅`));
});
 