import { inject, injectable } from "tsyringe";
import { Server, Socket } from "socket.io";
import { IVideoSession } from "../../types/session.types";
import { VideoSessionModel } from "../../models/session.model/video-session.models";
import { IVideoCallService } from "../Interface/IVideoCallService";
import { IVideoSessionRepository } from "../../repositories/Interface/IVideoSessionRepository";

@injectable()
export class VideoCallService implements IVideoCallService {
  constructor(
    @inject("VideoSessionRepository")
    private videoSessionRepository: IVideoSessionRepository,
    @inject("SocketIOServer")
    private io: Server
  ) {}

  public registerSocketEvents(socket: Socket) {
    socket.on(
      "joinSession",
      async (data: { bookingId: string; userId: string; userType: string }) => {
        await this.handleJoinSession(socket, data);
      }
    );


    socket.on("disconnect", () => {
      this.handleDisconnect(socket.id);
    });

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

    socket.on("user-status", (data) => {
      this.handleUserStatus(socket, data);
    });

    socket.on("user-left", (data) => {
      this.handleUserLeft(socket, data.bookingId);
    });
  }

  async handleJoinSession(
    socket: Socket,
    data: { bookingId: string; userId: string; userType: string }
  ) {
    const { bookingId, userId, userType } = data;

    socket.join(bookingId);

    let session = await this.videoSessionRepository.findSessionByBookingId(
      bookingId
    );

    if (!session) {
      session = await this.videoSessionRepository.createSession(bookingId);
    }

    const update: Partial<IVideoSession> = {};
    if (userType === "trainer") {
      update.trainerSocketId = socket.id;
    } else {
      update.traineeSocketId = socket.id;
    }

    const updatedSession = await this.videoSessionRepository.updateSession(
      bookingId,
      update
    );

    if (updatedSession?.trainerSocketId && updatedSession?.traineeSocketId) {
      socket.to(updatedSession.trainerSocketId).emit("readyForCall");
      socket.to(updatedSession.traineeSocketId).emit("readyForCall");
    }
  }

  async handleDisconnect(socketId: string) {
    const session = await VideoSessionModel.findOne({
      $or: [{ trainerSocketId: socketId }, { traineeSocketId: socketId }],
    });

    if (session) {
      const otherUserSocketId =
        session.trainerSocketId === socketId
          ? session.traineeSocketId
          : session.trainerSocketId;

      if (otherUserSocketId) {
        this.io.to(otherUserSocketId).emit("callEnded", {
          bookingId: session.bookingId,
        });
      }

      await this.videoSessionRepository.endSession(session.bookingId);
    }
  }

  async handleUserStatus(
    socket: Socket,
    data: {
      bookingId: string;
      isMuted: boolean;
      isVideoOn: boolean;
      isConnected: boolean;
    }
  ) {
    const session = await this.videoSessionRepository.findSessionByBookingId(
      data.bookingId
    );
    if (!session) return;

    const otherUserSocketId =
      session.trainerSocketId === socket.id
        ? session.traineeSocketId
        : session.trainerSocketId;

    if (otherUserSocketId) {
      this.io.to(otherUserSocketId).emit("user-status", data);
    }
  }

  async handleUserLeft(socket: Socket, bookingId: string) {
    const session = await this.videoSessionRepository.findSessionByBookingId(
      bookingId
    );
    if (!session) return;

    const userType =
      session.trainerSocketId === socket.id ? "trainer" : "trainee";
    const otherUserSocketId =
      userType === "trainer"
        ? session.traineeSocketId
        : session.trainerSocketId;

    if (otherUserSocketId) {
      this.io.to(otherUserSocketId).emit("user-left", {
        bookingId,
      });
    }
  }
}
