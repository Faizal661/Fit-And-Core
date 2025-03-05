//packages
import "reflect-metadata"
import express, { request } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

//configurations
import connectDB from "./config/db.config";

//routers & middlewares 
import authRoutes from "./routes/authentication.routes"
// import UserRoutes from "./routes/user.routes.ts";



const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.use("/api/auth", authRoutes);
// app.use("/api/users", UserRoutes);
 
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});