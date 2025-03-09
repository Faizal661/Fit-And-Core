// Packages
import "reflect-metadata";
import express, { NextFunction, response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routers
import authRoutes from "./routes/authentication.routes";
// import UserRoutes from "./routes/user.routes.ts";

// Configurations
import connectDB from "./config/db.config";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares
import requestLogging from "./middlewares/request.middleware";
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//log req & res details
const loggers = requestLogging();
loggers.forEach(middleware => app.use(middleware));

// Routers
app.use("/api/auth", authRoutes);
// app.use("/api/users", UserRoutes);


connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server connection   ✅`));
});
