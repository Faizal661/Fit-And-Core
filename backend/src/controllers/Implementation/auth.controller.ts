import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpResCode, HttpResMsg } from "../../constants/http-response.constants";
import { IAuthController } from "../Interface/IAuthController";
import { IAuthService } from "../../services/Interface/IAuthService";
import { sendResponse } from "../../utils/send-response";
import passport from "passport";
import logger from "../../utils/logger.utils";
import CustomError from "../../errors/CustomError";
import env from "../../config/env.config";

@injectable()
export default class AuthController implements IAuthController {
  private authService: IAuthService;

  constructor(
    @inject("AuthService")
    authService: IAuthService
  ) {
    this.authService = authService;
  }

  async checkUsernameEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, username,password }: { email: string; username: string;password:string } = req.body;
      const result = await this.authService.nameEmailCheck(email, username);
      if (!result.available) {
        sendResponse(res, HttpResCode.CONFLICT, result.message);
        return;
      }
      await this.authService.sendOtp(email);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {...result,password});
    } catch (error) {
      next(error);
    }
  }

  async checkEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email }: { email: string } = req.body;
      const result = await this.authService.isValidEmail(email);
      if (!result.isValid) {
        sendResponse(res, HttpResCode.NOT_FOUND, HttpResMsg.NOT_FOUND);
        return;
      }
      await this.authService.sendOtp(email);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, result);
    } catch (error) {
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
      const isValid = await this.authService.verifyOtp(email, otp);
      if (!isValid.success) {
        sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, isValid);
        return;
      }
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, isValid);
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
      await this.authService.sendOtp(email);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        sendResponse(res, HttpResCode.BAD_REQUEST, HttpResMsg.BAD_REQUEST);
        return;
      }
      const isUpdated = await this.authService.updatePassword(email, password);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS);
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
        sendResponse(res, HttpResCode.BAD_REQUEST, HttpResMsg.BAD_REQUEST);
        return;
      }
      const newUser = await this.authService.registerUser(
        username,
        email,
        password
      );
      sendResponse(res, HttpResCode.CREATED, HttpResMsg.CREATED, {
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

      const { user, accessToken, refreshToken } = await this.authService.login(
        email,
        password
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      });

      logger.info(`User ${email} logged in successfully.`);

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        user,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  googleAuth(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })(req, res, next);
  }

  googleCallback(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate(
      "google",
      { session: false },
      async (err, googleUser) => {
        try {
          if (err || !googleUser) {
            return res.redirect(
              `${env.CLIENT_ORIGIN}/login?error=google_auth_failed`
            );
          }

          const { user, accessToken, refreshToken } =
            await this.authService.googleLogin(googleUser);

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
          });

          res.redirect(
            `${env.CLIENT_ORIGIN}/auth/success?token=${accessToken}`
          );
        } catch (error) {
          next(error);
        }
      }
    )(req, res, next);
  }
  async verifyGoogleToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) {
        throw new CustomError(HttpResMsg.NO_ACCESS_TOKEN,HttpResCode.UNAUTHORIZED);
      }

      const { user, accessToken, refreshToken } =
        await this.authService.verifyGoogleToken(token);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      });

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
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
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  
}
