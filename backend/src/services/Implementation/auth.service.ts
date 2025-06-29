import { inject, injectable } from "tsyringe";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.util";
import {
  IGoogleUser,
  IJwtDecoded,
  ILoginResponse,
} from "../../types/auth.types";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import logger from "../../utils/logger.utils";
import env from "../../config/env.config";
import { IAuthService } from "../Interface/IAuthService";
import { sendEmail } from "../../utils/email.util";
import { IUserModel } from "../../models/user.models";
import { generateOtp } from "../../utils/otp-generate.util";
import CustomError from "../../errors/CustomError";
import { IAuthRepository } from "../../repositories/Interface/IAuthRepository";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { BaseError } from "../../errors/BaseError";

@injectable()
export default class authService implements IAuthService {
  private authRepository: IAuthRepository;

  constructor(
    @inject("AuthRepository")
    authRepository: IAuthRepository
  ) {
    this.authRepository = authRepository;
  }

  async nameEmailCheck(
    email: string,
    username: string
  ): Promise<{
    available: boolean;
    username?: string;
    email?: string;
    message: string;
  }> {
    const isUsernameTaken = await this.authRepository.isUsernameTaken(username);
    const isEmailTaken = await this.authRepository.isEmailTaken(email);
    if (isUsernameTaken) {
      return { available: false, message: HttpResMsg.USERNAME_CONFLICT };
    } else if (isEmailTaken) {
      return { available: false, message: HttpResMsg.EMAIL_CONFLICT };
    }
    return {
      available: true,
      username: username,
      email: email,
      message: HttpResMsg.USERNAME_EMAIL_AVAILABLE,
    };
  }

  async isValidEmail(
    email: string
  ): Promise<{ isValid: boolean; email: string }> {
    const isValid = await this.authRepository.isEmailTaken(email);
    if (!isValid) {
      return { isValid: false, email: email };
    }
    return {
      isValid: true,
      email: email,
    };
  }

  async sendOtp(email: string): Promise<void> {
    const otp = generateOtp();
    console.warn("otp - - >", otp);
    try {
      await this.authRepository.storeOtp(email, otp);
      await sendEmail(email, otp);
    } catch (error) {
      if (error instanceof Error) {
        throw new CustomError(error.message, HttpResCode.INTERNAL_SERVER_ERROR);
      } else {
        throw new CustomError(
          HttpResMsg.OTP_SEND_FAILED,
          HttpResCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async verifyOtp(
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> {
    const storedOtp = await this.authRepository.getOtp(email);
    if (!storedOtp || storedOtp !== otp) {
      return { success: false, message: HttpResMsg.INVALID_OTP };
    }
    await this.authRepository.deleteOtp(email);
    return { success: true, message: HttpResMsg.OTP_VERIFIED };
  }

  async updatePassword(
    email: string,
    password: string
  ): Promise<{ isUpdated: boolean }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.authRepository.updatepassword(email, hashedPassword);
    return { isUpdated: true };
  }

  async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<IUserModel> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.authRepository.createUser({
      username,
      email,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string): Promise<ILoginResponse> {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      logger.warn(`${HttpResMsg.INVALID_CREDENTIALS} ${email}`);
      throw new CustomError(
        HttpResMsg.INVALID_CREDENTIALS,
        HttpResCode.UNAUTHORIZED
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      logger.warn(`${HttpResMsg.INVALID_CREDENTIALS} ${email}`);
      throw new CustomError(
        HttpResMsg.INVALID_CREDENTIALS,
        HttpResCode.UNAUTHORIZED
      );
    }

    if (user.isBlocked) {
      throw new CustomError(HttpResMsg.ACCOUNT_BLOCKED, HttpResCode.FORBIDDEN);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user._id as string,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async verifyGoogleToken(token: string): Promise<ILoginResponse> {
    try {
      const accessToken = token;
      if (!accessToken) {
        throw new CustomError(
          HttpResMsg.NO_ACCESS_TOKEN,
          HttpResCode.UNAUTHORIZED
        );
      }
      const decoded = jwt.verify(
        accessToken,
        env.ACCESS_TOKEN_SECRET!
      ) as IJwtDecoded;

      const user = await this.authRepository.findByEmail(decoded.email);
      if (!user) {
        throw new CustomError(
          HttpResMsg.USER_NOT_FOUND,
          HttpResCode.UNAUTHORIZED
        );
      }

      if (user.isBlocked) {
        throw new CustomError(
          HttpResMsg.ACCOUNT_BLOCKED,
          HttpResCode.FORBIDDEN
        );
      }

      const refreshToken = generateRefreshToken(user);
      return {
        user: {
          id: user._id as string,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        HttpResMsg.INVALID_ACCESS_TOKEN,
        HttpResCode.UNAUTHORIZED
      );
    }
  }

  async googleLogin(googleUser: IGoogleUser): Promise<ILoginResponse> {
    const user = await this.authRepository.findOrCreateGoogleUser(googleUser);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const result = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
    return result;
  }
}
