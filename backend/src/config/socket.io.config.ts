import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import { container } from "tsyringe";
import { env } from "./env.config";
import { IVideoCallService } from "../services/Interface/IVideoCallService";

export const configureSocketIO = (app: express.Application) => {
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_ORIGIN,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  container.registerInstance("SocketIOServer", io);
  const videoCallService =
    container.resolve<IVideoCallService>("VideoCallService");

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    videoCallService.registerSocketEvents(socket);
  });

  return httpServer;
};
