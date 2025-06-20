import { injectable } from "tsyringe";
import {
  IVideoSessionModel,
  VideoSessionModel,
} from "../../models/session.model/video-session.models";
import { IVideoSession } from "../../types/session.types";
import { BaseRepository } from "./base.repository";
import { IVideoSessionRepository } from "../Interface/IVideoSessionRepository";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class VideoSessionRepository
  extends BaseRepository<IVideoSessionModel>
  implements IVideoSessionRepository
{
  constructor() {
    super(VideoSessionModel);
  }

  async createSession(bookingId: string): Promise<IVideoSession> {
    try {
      return this.create({ bookingId });
    } catch (error) {
      throw new CustomError(
        "failed to create session",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findSessionByBookingId(
    bookingId: string
  ): Promise<IVideoSession | null> {
    try {
      return this.findOne({ bookingId });
    } catch (error) {
      throw new CustomError(
        "failed to find session by booking id",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateSession(
    bookingId: string,
    update: Partial<IVideoSession>
  ): Promise<IVideoSession | null> {
    try {
      return VideoSessionModel.findOneAndUpdate({ bookingId }, update, {
        new: true,
      });
    } catch (error) {
      throw new CustomError(
        "failed to update session",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async endSession(bookingId: string): Promise<IVideoSession | null> {
       try {
         return VideoSessionModel.findOneAndUpdate(
           { bookingId },
           { status: "ended", endedAt: new Date() },
           { new: true }
         );
    } catch (error) {
      throw new CustomError(
        "failed to end session",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
