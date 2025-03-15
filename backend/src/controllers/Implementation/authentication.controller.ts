import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  HttpResponseCode,
  HttpResponseMessage,
} from "../../constants/Response.constants";

import { IAuthenticationController } from "../Interface/IAuthenticationController";
import { IAuthenticationService } from "../../services/Interface/IAuthenticationService";
import { SendResponse, UnauthorizedError } from "mern.common";

@injectable()
export default class AuthenticationController
  implements IAuthenticationController
{
  private authenticationService: IAuthenticationService;

  constructor(
    @inject("AuthenticationService")
    authenticationService: IAuthenticationService
  ) {
    this.authenticationService = authenticationService;
  }

  async checkUsernameEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, username }: { email: string; username: string } = req.body;
      const result = await this.authenticationService.nameEmailCheck(
        email,
        username
      );
      console.log("result", result);
      if (!result.available) {
        SendResponse(res, HttpResponseCode.CONFLICT, result.message);
        return;
      }
      await this.authenticationService.sendOtp(email);
      SendResponse(
        res,
        HttpResponseCode.OK,
        HttpResponseMessage.SUCCESS,
        result
      );
    } catch (error: any) {
      next(error);
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;
      const isValid = await this.authenticationService.verifyOtp(email, otp);
      if (!isValid.success) {
        SendResponse(
          res,
          HttpResponseCode.OK,
          HttpResponseMessage.SUCCESS,
          isValid
        );
        return;
      }
      SendResponse(
        res,
        HttpResponseCode.OK,
        HttpResponseMessage.SUCCESS,
        isValid
      );
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      await this.authenticationService.sendOtp(email);
      SendResponse(res, HttpResponseCode.OK, HttpResponseMessage.SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        SendResponse(
          res,
          HttpResponseCode.BAD_REQUEST,
          HttpResponseMessage.BAD_REQUEST
        );
        return;
      }
      const newUser = await this.authenticationService.registerUser(
        username,
        email,
        password
      );
      console.log("user created => ", newUser);
      SendResponse(res, HttpResponseCode.CREATED, HttpResponseMessage.CREATED, {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } =
        await this.authenticationService.login(email, password);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      
      SendResponse(res, HttpResponseCode.OK, HttpResponseMessage.SUCCESS, {
        user,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("refreshToken");
      SendResponse(res, HttpResponseCode.OK, HttpResponseMessage.SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError("User not authenticated");
      }

      const { newAccessToken, newRefreshToken } =
        await this.authenticationService.refreshTokens(req.user.email);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      SendResponse(res, HttpResponseCode.OK, HttpResponseMessage.SUCCESS, {
        newAccessToken,
      });
    } catch (error) {
      next(error);
    }
  }
}
