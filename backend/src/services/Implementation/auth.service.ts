import { inject, injectable } from "tsyringe";
import { IAuthService } from "../Interface/IAuthService";
import { IAuthRepository } from "../../repositories/Interface/IAuthRepository";
import { sendEmail } from "../../utils/email.util";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserModel } from "../../models/user.models";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.util";
import {
  IGoogleUser,
  IJwtDecoded,
  ILoginResponse,
} from "../../types/auth.types";
import { generateOtp } from "../../utils/otp-generate.util";
import logger from "../../utils/logger.utils";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/response.constants";
import { env } from "../../config/env.config";

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
      return { available: false, message: "Username already taken" };
    } else if (isEmailTaken) {
      return { available: false, message: "Email already taken" };
    }
    return {
      available: true,
      username: username,
      email: email,
      message: "Username and Email are available.",
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
          "OTP sending failed: Unknown error occurred",
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
      return { success: false, message: "Invalid or expired OTP" };
    }
    await this.authRepository.deleteOtp(email);
    return { success: true, message: "OTP verified successfully" };
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
      logger.warn(`Failed login attempt for email: ${email}`);
      throw new CustomError(
        "Invalid email or password",
        HttpResCode.UNAUTHORIZED
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for email: ${email}`);
      throw new CustomError(
        "Invalid email or password",
        HttpResCode.UNAUTHORIZED
      );
    }

    if (user.isBlocked) {
      throw new CustomError(
        "Your account is blocked. Please contact support.",
        HttpResCode.FORBIDDEN
      );
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
          "Access denied. No token provided.",
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
          "No user Found on this email",
          HttpResCode.UNAUTHORIZED
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
    } catch (tokenError) {
      throw new CustomError(
        "Invalid or expired access token.",
        HttpResCode.UNAUTHORIZED
      );
    }
  }

  async googleLogin(googleUser: IGoogleUser): Promise<ILoginResponse> {
    const user = await this.authRepository.findOrCreateGoogleUser(googleUser);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}
