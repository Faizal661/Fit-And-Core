import { S3Client, PutObjectCommand, DeleteObjectCommand,ObjectCannedACL  } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "fit-core-app";

interface UploadedFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

interface S3UploadResult {
  Key: string;
  Location: string;
  Bucket: string;
}


/**
 * Upload file to S3 bucket (AWS SDK v3)
 */
export const uploadToS3 = async (
  file: UploadedFile,
  folder: string = "uploads"
): Promise<S3UploadResult> => {
  const fileExtension = file.originalname.split(".").pop() || "unknown";
  const fileName = `${folder}/${uuidv4()}-${Date.now()}.${fileExtension}`;

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: ObjectCannedACL.public_read,
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));

    return {
      Key: fileName,
      Location: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
      Bucket: BUCKET_NAME,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(`Failed to upload file to S3: ${(error as Error).message}`);
  }
};

/**
 * Delete file from S3 bucket (AWS SDK v3)
 */
export const deleteFromS3 = async (fileKey: string): Promise<void> => {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
  };

  try {
    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log(`File deleted from S3: ${fileKey}`);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error(`Failed to delete file from S3: ${(error as Error).message}`);
  }
};
