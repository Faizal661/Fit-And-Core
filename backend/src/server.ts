// Packages
import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// Import routers
import authRoutes from "./routes/authentication.routes";
// import UserRoutes from "./routes/user.routes.ts";

// Configurations
import connectDB from "./config/db.config";
dotenv.config();
const PORT = process.env.PORT || 5000;


const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Logs { method, url, status, response time }

// Routers
app.use("/api/auth", authRoutes);
// app.use("/api/users", UserRoutes);


connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server connection   ✅`));
});
