import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpResCode, HttpResMsg } from "../../constants/Response.constants";
import { IUserController } from "../Interface/IUserController";
import { IUserService } from "../../services/Interface/IUserService";
import { SendResponse } from "mern.common";

@injectable()
export default class UserController implements IUserController {
  private userService: IUserService;

  constructor(
    @inject("UserService")
    userService: IUserService
  ) {
    this.userService = userService;
  }

  async getUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;
      if (!userId) {
        return SendResponse(
          res,
          HttpResCode.UNAUTHORIZED,
          HttpResMsg.UNAUTHORIZED
        );
      }

      const userProfile = await this.userService.getUserProfile(userId);
      SendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, userProfile);
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;
      if (!userId) {
        return SendResponse(
          res,
          HttpResCode.UNAUTHORIZED,
          HttpResMsg.UNAUTHORIZED
        );
      }

      const updateData = req.body;
      const updatedProfile = await this.userService.updateUserProfile(
        userId,
        updateData
      );

      SendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;

      if (!userId) {
        return SendResponse(
          res,
          HttpResCode.UNAUTHORIZED,
          HttpResMsg.UNAUTHORIZED
        );
      }

      if (!req.file) {
        return SendResponse(
          res,

          HttpResCode.BAD_REQUEST,
          "No file uploaded"
        );
      }

      const updatedProfile = await this.userService.updateProfilePicture(
        userId,
        req.file
      );

      SendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, updatedProfile);
    } catch (error) {
      next(error);
    }
  }
}
