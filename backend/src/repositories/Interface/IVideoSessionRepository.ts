import { IVideoSessionModel } from "../../models/session.model/video-session.models";
import { IVideoSession } from "../../types/session.types";
import { BaseRepository } from "../Implementation/base.repository";

export interface IVideoSessionRepository
  extends Omit<BaseRepository<IVideoSessionModel>, "model"> {
  createSession(bookingId: string): Promise<IVideoSession>;
  findSessionByBookingId(bookingId: string): Promise<IVideoSession | null>;
  updateSession(
    bookingId: string,
    update: Partial<IVideoSession>
  ): Promise<IVideoSession | null>;
  endSession(bookingId: string): Promise<IVideoSession | null>;
}
