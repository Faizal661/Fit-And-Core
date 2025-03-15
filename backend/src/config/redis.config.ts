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
    console.log(Date.now())
});

redisClient.connect().then(() => {
    console.log("Redis Connection    ✅");
});

export default redisClient;
