//packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

//configurations
import connectDB from "./config/db.config";

//routers & middlewares 
// import UserRoutes from "./routes/user.routes.ts";


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/users", UserRoutes);
 
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});