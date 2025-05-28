import { injectable } from 'tsyringe';
import { VideoSessionModel } from '../../models/session.model/video-session.models';
import { IVideoSession } from '../../types/session.types';

@injectable()
export class VideoSessionRepository {
    
  async createSession(bookingId: string): Promise<IVideoSession> {
    return VideoSessionModel.create({ bookingId });
  }

  async findSessionByBookingId(bookingId: string): Promise<IVideoSession | null> {
    return VideoSessionModel.findOne({ bookingId });
  }

  async updateSession(
    bookingId: string,
    update: Partial<IVideoSession>
  ): Promise<IVideoSession | null> {
    return VideoSessionModel.findOneAndUpdate(
      { bookingId },
      update,
      { new: true }
    );
  }

  async endSession(bookingId: string): Promise<IVideoSession | null> {
    return VideoSessionModel.findOneAndUpdate(
      { bookingId },
      { status: 'ended', endedAt: new Date() },
      { new: true }
    );
  }
}