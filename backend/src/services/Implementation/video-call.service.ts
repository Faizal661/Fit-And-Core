import { container, inject, injectable } from "tsyringe";
import { Socket } from "socket.io";
import { VideoSessionRepository } from "../../repositories/Implementation/video-session.repository";
import { IVideoSession } from "../../types/session.types";
import { VideoSessionModel } from "../../models/session.model/video-session.models";

@injectable()
export class VideoCallService {
  constructor(
    @inject("VideoSessionRepository")
    private videoSessionRepository: VideoSessionRepository,
    @inject("SocketIOServer")
    private io: Socket
  ) {}

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
}