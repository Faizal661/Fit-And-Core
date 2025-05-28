import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { container } from "tsyringe";
import { VideoCallService } from "../services/Implementation/video-call.service";
import { env } from "./env.config";

export const configureSocketIO = (app: express.Application) => {
    
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  container.registerInstance("SocketIOServer", io);

  const videoCallService = container.resolve(VideoCallService);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on(
      "joinSession",
      async (data: { bookingId: string; userId: string; userType: string }) => {
        await videoCallService.handleJoinSession(socket, data);
      }
    );

    socket.on("disconnect", () => {
      videoCallService.handleDisconnect(socket.id);
    });

    // Add WebRTC signaling handlers
    socket.on("offer", (data) => {
      socket.to(data.bookingId).emit("offer", data);
    });

    socket.on("answer", (data) => {
      socket.to(data.bookingId).emit("answer", data);
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.bookingId).emit("ice-candidate", data);
    });

    socket.on("endCall", (data) => {
      socket.to(data.bookingId).emit("callEnded", data);
    });
  });

  return httpServer;
};
