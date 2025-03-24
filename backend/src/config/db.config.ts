import mongoose from "mongoose";
import { env } from "./env.config";


const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI as string);
    console.log("Database connection ✅");
  } catch (error) {
    console.error('Error connecting to the database: ',error)
    process.exit(1);
  }
};

export default connectDB;
