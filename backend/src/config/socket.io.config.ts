import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import { container } from "tsyringe";
import env from "./env.config";
import { IVideoCallService } from "../services/Interface/IVideoCallService";
import { IBookingRepository } from "../repositories/Interface/IBookingRepository";
import { ITrainerRepository } from "../repositories/Interface/ITrainerRepository";
import { Types } from "mongoose";

const configureSocketIO = (app: express.Application) => {
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
  const bookingRepository =
    container.resolve<IBookingRepository>("BookingRepository");
  const trainerRepository =
    container.resolve<ITrainerRepository>("TrainerRepository");


  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    videoCallService.registerSocketEvents(socket);

    socket.on("registerUserSocket", (userId: string) => {

      socket.join(userId);
    });

    socket.on(
      "initiate-call",
      async (data: {
        bookingId: string;
        callerId: string;
        callerType: "trainer" | "trainee";
      }) => {

        const booking = await bookingRepository.findById(
          new Types.ObjectId(data.bookingId)
        );

        const calleeSocketId =booking?.userId

        const trainer = await trainerRepository.findById(
          new Types.ObjectId(data.callerId)
        );

        if (calleeSocketId) {
          io.to(calleeSocketId.toString()).emit("incoming-call", {
            bookingId: data.bookingId,
            callerId: data.callerId,
            callerType: data.callerType,
            callerName: trainer?.username,
            callerProfilePicture: trainer?.profilePicture,
          });
        }
      }
    );

    socket.on("accept-call", async (data: { bookingId: string }) => {
      socket.to((data.bookingId)?.toString()!).emit("call-accepted");
    });

    socket.on("reject-call", (data: { bookingId: string }) => {
      socket.to(data.bookingId).emit("call-rejected");
    });
  });

  return httpServer;
};

export default configureSocketIO;
