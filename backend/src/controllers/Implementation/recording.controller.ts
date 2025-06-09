import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { sendResponse } from "../../utils/send-response";
import { HttpResCode, HttpResMsg } from "../../constants/http-response.constants";
import { IRecordingController } from "../Interface/IRecordingController";
import { IRecordingService } from "../../services/Interface/IRecordingService";

@injectable()
export class RecordingController implements IRecordingController {
  constructor(
    @inject("RecordingService") private recordingService: IRecordingService
  ) {}

  async uploadRecording(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
         sendResponse(
          res,
          HttpResCode.BAD_REQUEST,
          "No video file uploaded.",
        );
        return;
      }
      const result = await this.recordingService.uploadVideo(req.file);

       sendResponse(
        res,
        HttpResCode.CREATED,
        HttpResMsg.VIDEO_UPLOADED_SUCCESSFULLY,
        result
      ); 
    } catch (error) {
       next(error);
    }
  }
}
