import { inject, injectable } from "tsyringe";
import { uploadToCloudinary } from "../../utils/cloud-storage";
import { IRecordingService } from "../Interface/IRecordingService";
import { IBookingRepository } from "../../repositories/Interface/IBookingRepository";
import { Types } from "mongoose";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

export interface UploadResult {
  url: string;
  publicId: string;
  folder: string;
  size: number;
}

@injectable()
export class RecordingService implements IRecordingService {
  constructor(
    @inject("BookingRepository")
    private bookingRepository: IBookingRepository
  ) {}
  async uploadVideo(file: Express.Multer.File): Promise<UploadResult> {
    try {
      if (!file.mimetype.startsWith("video/")) {
        throw new Error("Only video files are allowed");
      }

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size exceeds maximum limit of 100MB");
      }

      const match = file.originalname.match(
        /^recording_(.+?)_(.+?)_\d+\.webm$/
      );
      if (!match) {
        throw new Error("Invalid file name format");
      }
      const userType = match[1];
      const bookingId = match[2];

      if (!["trainer", "trainee"].includes(userType)) {
        throw new Error("Invalid user type. Must be 'trainer' or 'trainee'");
      }

      const result = await uploadToCloudinary(file, "videoRecordings");

      if (!result || !result.Location) {
        throw new Error("Failed to upload video to Cloudinary");
      }

      const updateQuery =
        userType === "trainer"
          ? {
              trainerVideoUrl: result.Location,
              trainerVideoUploadedAt: new Date(),
            }
          : {
              traineeVideoUrl: result.Location,
              traineeVideoUploadedAt: new Date(),
            };

      await this.bookingRepository.updateOne(
        { _id: new Types.ObjectId(bookingId) },
        { $set: updateQuery }
      );

      return {
        url: result.Location,
        publicId: result.public_id,
        folder: result.Bucket,
        size: file.size,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Video upload failed",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
