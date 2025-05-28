import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { VideoCallService } from "../../services/Implementation/video-call.service";
import { WebRTCConfig } from "../../config/webrtc.config";

@injectable()
export class VideoCallController {
  constructor(
    @inject("VideoCallService")
    private videoCallService: VideoCallService
  ) {}

  async getIceServers(req: Request, res: Response, next: NextFunction) {
    try {
      const iceServers = WebRTCConfig.iceServers;
      res.json({ iceServers });
    } catch (error) {
      next(error);
    }
  }
}
