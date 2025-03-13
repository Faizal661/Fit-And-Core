import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IAuthenticationController } from "../Interface/IAuthenticationController";
import { IAuthenticationService } from "../../services/Interface/IAuthenticationService";
import { HTTPStatusCodes, ResponseMessage, SendResponse } from "mern.common";

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
        SendResponse(res, HTTPStatusCodes.CONFLICT, result.message);
        return;
      }
      await this.authenticationService.sendOtp(email);
      SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result);
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
        SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, isValid);
        return;
      }
      SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, isValid);
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
          HTTPStatusCodes.BAD_REQUEST,
          ResponseMessage.BAD_REQUEST
        );
        return;
      }
      const newUser = await this.authenticationService.registerUser(
        username,
        email,
        password
      );
      console.log("user created => ", newUser);
      SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED, {
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

      //   Set refresh token in HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {
        user,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req);
      return 
    } catch (error) {
      next(error);
    }
  }
}
