import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpResCode, HttpResMsg } from "../../constants/response.constants";
import { IUserController } from "../Interface/IUserController";
import { IUserService } from "../../services/Interface/IUserService";
import { sendResponse } from "../../utils/send-response";

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
        sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
        return;
      }

      const userProfile = await this.userService.getUserProfile(userId);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, userProfile);
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
        sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
        return;
      }

      const updateData = req.body;
      const updatedProfile = await this.userService.updateUserProfile(
        userId,
        updateData
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, updatedProfile);
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
        sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
        return;
      }

      if (!req.file) {
        sendResponse(res, HttpResCode.BAD_REQUEST, "No file uploaded");
        return;
      }

      const updatedProfile = await this.userService.updateProfilePicture(
        userId,
        req.file
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email = req.decoded?.email;
      if (!email) {
        sendResponse(res, HttpResCode.UNAUTHORIZED, HttpResMsg.UNAUTHORIZED);
        return;
      }
      let { currentPassword,newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        sendResponse(res, HttpResCode.BAD_REQUEST, HttpResMsg.BAD_REQUEST);
        return;
      }

      const isUpdated = await this.userService.updatePassword(email,currentPassword, newPassword);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS);
    } catch (error) {
      next(error);
    }
  }
}
