import { EnvErrMsg } from "../constants/env-error-messages.constants";
import { HttpResCode } from "../constants/response.constants";
import { CustomError } from "../errors/CustomError";

export const env = {
  get PORT(): number {
    const port = process.env.PORT;
    if (!port) {
      throw new CustomError(
        EnvErrMsg.PORT_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber)) {
      throw new CustomError(EnvErrMsg.PORT_INVALID, HttpResCode.BAD_REQUEST);
    }
    return portNumber;
  },

  get NODE_ENV() {
    return process.env.NODE_ENV || "development";
  },

  get CLIENT_ORIGIN() {
    if (!process.env.CLIENT_ORIGIN) {
      throw new CustomError(
        EnvErrMsg.CLIENT_ORIGIN_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.CLIENT_ORIGIN;
  },

  // JWT Secrets
  get ACCESS_TOKEN_SECRET() {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new CustomError(
        EnvErrMsg.ACCESS_TOKEN_SECRET_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.ACCESS_TOKEN_SECRET;
  },
  get REFRESH_TOKEN_SECRET() {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new CustomError(
        EnvErrMsg.REFRESH_TOKEN_SECRET_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.REFRESH_TOKEN_SECRET;
  },

  // Database Connection URI
  get MONGO_URI() {
    if (!process.env.MONGO_URI) {
      throw new CustomError(
        EnvErrMsg.MONGO_URI_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.MONGO_URI;
  },

  // Redis Configuration for OTP Storing
  get REDIS_USERNAME() {
    if (!process.env.REDIS_USERNAME) {
      throw new CustomError(
        EnvErrMsg.REDIS_USERNAME_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.REDIS_USERNAME;
  },
  get REDIS_PASSWORD() {
    if (!process.env.REDIS_PASSWORD) {
      throw new CustomError(
        EnvErrMsg.REDIS_PASSWORD_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.REDIS_PASSWORD;
  },
  get REDIS_HOST() {
    if (!process.env.REDIS_HOST) {
      throw new CustomError(
        EnvErrMsg.REDIS_HOST_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.REDIS_HOST;
  },
  get REDIS_PORT() {
    const port = process.env.REDIS_PORT;
    if (!port) {
      throw new CustomError(
        EnvErrMsg.REDIS_PORT_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber)) {
      throw new CustomError(
        EnvErrMsg.REDIS_PORT_INVALID,
        HttpResCode.BAD_REQUEST
      );
    }
    return portNumber;
  },

  // google authentication
  get GOOGLE_CLIENT_ID() {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new CustomError(
        EnvErrMsg.GOOGLE_CLIENT_ID_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.GOOGLE_CLIENT_ID;
  },
  get GOOGLE_CLIENT_SECRET() {
    if (!process.env.GOOGLE_CLIENT_SECRET) {
      throw new CustomError(
        EnvErrMsg.GOOGLE_CLIENT_SECRET_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.GOOGLE_CLIENT_SECRET;
  },

  // AWS CONFIG
  get AWS_ACCESS_KEY_ID() {
    if (!process.env.AWS_ACCESS_KEY_ID) {
      throw new CustomError(
        EnvErrMsg.AWS_ACCESS_KEY_ID_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.AWS_ACCESS_KEY_ID;
  },
  get AWS_SECRET_ACCESS_KEY() {
    if (!process.env.AWS_SECRET_ACCESS_KEY) {
      throw new CustomError(
        EnvErrMsg.AWS_SECRET_ACCESS_KEY_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.AWS_SECRET_ACCESS_KEY;
  },
  get AWS_REGION() {
    if (!process.env.AWS_REGION) {
      throw new CustomError(
        EnvErrMsg.AWS_REGION_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.AWS_REGION;
  },

  // AWS SES (Simple Email Service) Configuration for Sending OTP Through Email
  get SES_EMAIL_FROM() {
    if (!process.env.SES_EMAIL_FROM) {
      throw new CustomError(
        EnvErrMsg.SES_EMAIL_FROM_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.SES_EMAIL_FROM;
  },

  // AWS S3 BUCKET
  get AWS_S3_BUCKET_NAME() {
    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new CustomError(
        EnvErrMsg.AWS_S3_BUCKET_NAME_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.AWS_S3_BUCKET_NAME;
  },

  // NODEMAILER
  get SMTP_HOST() {
    if (!process.env.SMTP_HOST) {
      throw new CustomError(
        EnvErrMsg.SMTP_HOST_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.SMTP_HOST;
  },
  get SMTP_PORT() {
    const port = process.env.SMTP_PORT;
    if (!port) {
      throw new CustomError(
        EnvErrMsg.SMTP_PORT_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber)) {
      throw new CustomError(
        EnvErrMsg.SMTP_PORT_INVALID,
        HttpResCode.BAD_REQUEST
      );
    }
    return portNumber;
  },
  get SMTP_SECURE() {
    if (!process.env.SMTP_SECURE) {
      throw new CustomError(
        EnvErrMsg.SMTP_SECURE_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.SMTP_SECURE;
  },
  get SMTP_USERNAME() {
    if (!process.env.SMTP_USERNAME) {
      throw new CustomError(
        EnvErrMsg.SMTP_USERNAME_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.SMTP_USERNAME;
  },
  get SMTP_PASSWORD() {
    if (!process.env.SMTP_PASSWORD) {
      throw new CustomError(
        EnvErrMsg.SMTP_PASSWORD_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.SMTP_PASSWORD;
  },

  get CLOUDINARY_CLOUD_NAME(): string {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new CustomError(
        EnvErrMsg.CLOUDINARY_CLOUD_NAME_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.CLOUDINARY_CLOUD_NAME;
  },
  
  get CLOUDINARY_API_KEY(): string {
    if (!process.env.CLOUDINARY_API_KEY) {
      throw new CustomError(
        EnvErrMsg.CLOUDINARY_API_KEY_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.CLOUDINARY_API_KEY;
  },
  
  get CLOUDINARY_API_SECRET(): string {
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new CustomError(
        EnvErrMsg.CLOUDINARY_API_SECRET_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.CLOUDINARY_API_SECRET;
  },

  get STRIPE_SECRET_KEY(): string {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new CustomError(
        EnvErrMsg.STRIPE_SECRET_KEY_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.STRIPE_SECRET_KEY;
  },

  get STRIPE_WEBHOOK_SECRET(): string {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new CustomError(
        EnvErrMsg.STRIPE_WEBHOOK_SECRET_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
    return process.env.STRIPE_WEBHOOK_SECRET;
  },
};
