import { injectable } from "tsyringe";
import {
  IVideoSessionModel,
  VideoSessionModel,
} from "../../models/session.model/video-session.models";
import { IVideoSession } from "../../types/session.types";
import { BaseRepository } from "./base.repository";
import { IVideoSessionRepository } from "../Interface/IVideoSessionRepository";

@injectable()
export class VideoSessionRepository
  extends BaseRepository<IVideoSessionModel>
  implements IVideoSessionRepository
{
  constructor() {
    super(VideoSessionModel);
  }

  async createSession(bookingId: string): Promise<IVideoSession> {
    return this.create({ bookingId });
  }

  async findSessionByBookingId(
    bookingId: string
  ): Promise<IVideoSession | null> {
    return this.findOne({ bookingId });
  }

  async updateSession(
    bookingId: string,
    update: Partial<IVideoSession>
  ): Promise<IVideoSession | null> {
    return VideoSessionModel.findOneAndUpdate({ bookingId }, update, {
      new: true,
    });
  }

  async endSession(bookingId: string): Promise<IVideoSession | null> {
    return VideoSessionModel.findOneAndUpdate(
      { bookingId },
      { status: "ended", endedAt: new Date() },
      { new: true }
    );
  }
}
