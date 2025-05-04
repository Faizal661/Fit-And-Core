import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { CustomError } from "../errors/CustomError";
import { HttpResCode, HttpResMsg } from "../constants/http-response.constants";
import { env } from "../config/env.config";
import logger from "./logger.utils";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME!,
  api_key: env.CLOUDINARY_API_KEY!,
  api_secret: env.CLOUDINARY_API_SECRET!,
  secure: true,
});

interface UploadedFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

interface CloudinaryUploadResult {
  Key: string;
  Location: string;
  Bucket: string;
  public_id: string;
}

export const uploadToCloudinary = async (
  file: UploadedFile,
  folder: string = "uploads"
): Promise<CloudinaryUploadResult> => {
  const fileExtension = file.originalname.split(".").pop() || "unknown";
  const fileName = `${uuidv4()}-${Date.now()}`;

  try {
    // Convert buffer to base64 for cloudinary upload
    const base64Data = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      public_id: fileName,
      resource_type: "auto",
    });

    return {
      Key: result.public_id,
      Location: result.secure_url,
      Bucket: folder,
      public_id: result.public_id,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new CustomError(error.message, HttpResCode.INTERNAL_SERVER_ERROR);
    } else {
      logger.error(error);
      throw new CustomError(
        HttpResMsg.FAILED_UPLOAD_FILE,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(HttpResMsg.FAILED_DELETE_FROM_CLOUDINARY);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new CustomError(error.message, HttpResCode.INTERNAL_SERVER_ERROR);
    } else {
      throw new CustomError(
        HttpResMsg.FAILED_DELETE_FROM_CLOUDINARY,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
};

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(.+)$/);
    return matches ? matches[1] : null;
  } catch (error) {
    logger.error(HttpResMsg.FAILED_EXTRACT_PUBLIC_ID, error);
    return null;
  }
};
