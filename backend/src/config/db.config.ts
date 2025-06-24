import mongoose from "mongoose";
import env from "./env.config";
import { HttpResMsg } from "../constants/http-response.constants";


const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI as string);
    console.log(HttpResMsg.DATABASE_CONNECTION);
  } catch (error) {
    console.error(HttpResMsg.DATABASE_ERROR,error)
    process.exit(1);
  }
};

export default connectDB;
