import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpResCode, HttpResMsg } from "../../constants/http-response.constants";
import { IUserController } from "../Interface/IUserController";
import { IUserService } from "../../services/Interface/IUserService";
import { sendResponse } from "../../utils/send-response";
import { CustomError } from "../../errors/CustomError";

@injectable()
export default class UserController implements IUserController {
  private userService: IUserService;

  constructor(
    @inject("UserService")
    userService: IUserService
  ) {
    this.userService = userService;
  }
  
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = "1", limit = "10", search = "" } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        throw new CustomError("Invalid pagination parameters", HttpResCode.BAD_REQUEST);
      }

      const result = await this.userService.getUsers(pageNum, limitNum, search as string);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, result);
    } catch (error) {
      next(error);
    }
  }

  async toggleBlockStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { isBlocked } = req.body;

      if (typeof isBlocked !== "boolean") {
        throw new CustomError("isBlocked must be a boolean", HttpResCode.BAD_REQUEST);
      }

      const updatedUser = await this.userService.toggleBlockStatus(userId, isBlocked);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, updatedUser);
    } catch (error) {
      next(error);
    }
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

      await this.userService.updatePassword(email,currentPassword, newPassword);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS);
    } catch (error) {
      next(error);
    }
  }
}
