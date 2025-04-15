import { createClient } from "redis";
import { env } from "./env.config";
import { HttpResMsg } from "../constants/http-response.constants";

const redisClient = createClient({
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
    socket: {
        host: env.REDIS_HOST,
        port: Number(env.REDIS_PORT) ,
    }
});

redisClient.on("error", (err) => {
    console.error(HttpResMsg.REDIS_CLIENT_ERROR, err);
    console.log(Date.now())
});

redisClient.connect().then(() => {
    console.log(HttpResMsg.REDIS_CONNECTION);
});

export default redisClient;
