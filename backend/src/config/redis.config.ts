import { createClient } from "redis";
import dotenv from "dotenv"
dotenv.config();

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) ,
    }
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Client Error:", err);
});

redisClient.connect().then(() => {
    console.log("✅ Connected to Redis");
});

export default redisClient;
