import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, ConflictError } from "mern.common";
import { IAuthenticationService } from "../Interface/IAuthenticationService";
import { IAuthenticationRepository } from "../../repositories/Interface/IAuthenticationRepository";
import { sendEmail } from "../../utils/email.util";
import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUserModel } from "../../models/user.models";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.util";
import { UnauthorizedError } from "mern.common";
import { jwtDecoded } from "../../types/user.types";

@injectable()
export default class AuthenticationService implements IAuthenticationService {
  private authenticationRepository: IAuthenticationRepository;

  constructor(
    @inject("AuthenticationRepository")
    authenticationRepository: IAuthenticationRepository
  ) {
    this.authenticationRepository = authenticationRepository;
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
    const isUsernameTaken = await this.authenticationRepository.isUsernameTaken(
      username
    );
    const isEmailTaken = await this.authenticationRepository.isEmailTaken(
      email
    );
    if (isUsernameTaken) {
      return { available: false, message: "Username already taken" };
    } else if (isEmailTaken) {
      return { available: false, message: "Email already taken" };
    }
    return {
      available: true,
      username: username,
      email: email,
      message: "Success",
    };
  }

  async sendOtp(email: string): Promise<void> {
    const otp = randomInt(100000, 999999).toString();
    console.log("otp->", otp);
    await this.authenticationRepository.storeOtp(email, otp);
    await sendEmail(email, otp);
  }

  async verifyOtp(
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> {
    const storedOtp = await this.authenticationRepository.getOtp(email);
    // console.log('redisOtp=>',storedOtp)
    if (!storedOtp || storedOtp !== otp) {
      return { success: false, message: "Invalid or expired OTP" };
    }
    await this.authenticationRepository.deleteOtp(email);
    // console.log('otp deleted from redis')
    return { success: true, message: "OTP verified successfully" };
  }

  async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<IUserModel> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.authenticationRepository.createUser({
      username,
      email,
      password: hashedPassword,
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    user: { id: string; username: string; email: string,role:string };
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.authenticationRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user._id as string,
        username: user.username,
        email: user.email,
        role:user.role
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    email: string
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {

    const user = await this.authenticationRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return { newAccessToken, newRefreshToken };
  }
}
