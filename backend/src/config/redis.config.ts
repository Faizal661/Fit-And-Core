import { createClient } from "redis";
import { env } from "./env.config";

const redisClient = createClient({
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
    socket: {
        host: env.REDIS_HOST,
        port: Number(env.REDIS_PORT) ,
    }
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error:❌", err);
    console.log(Date.now())
});

redisClient.connect().then(() => {
    console.log("Redis Connection    ✅");
});

export default redisClient;
