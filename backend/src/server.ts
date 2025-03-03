//packages
import express, { request } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log()
//configurations
import connectDB from "./config/db.config";

//routers & middlewares 
// import UserRoutes from "./routes/user.routes.ts";
import AuthRoutes from "./routes/auth.routes.ts"

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", AuthRoutes);
// app.use("/api/users", UserRoutes);
 
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});