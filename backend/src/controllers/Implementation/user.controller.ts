import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  HttpResponseCode,
  HttpResponseMessage,
} from "../../constants/Response.constants";
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
          HttpResponseCode.UNAUTHORIZED,
          HttpResponseMessage.UNAUTHORIZED
        );
      }
      
      const userProfile = await this.userService.getUserProfile(userId);
      SendResponse(
        res,
        HttpResponseCode.OK,
        HttpResponseMessage.SUCCESS,
        userProfile
      );
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
          HttpResponseCode.UNAUTHORIZED,
          HttpResponseMessage.UNAUTHORIZED
        );
      }
      
      const updateData = req.body;
      const updatedProfile = await this.userService.updateUserProfile(
        userId,
        updateData
      );
      
      SendResponse(
        res,
        HttpResponseCode.OK,
        HttpResponseMessage.SUCCESS,
        updatedProfile
      );
    } catch (error) {
      next(error);
    }
  }

  async updateProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void>{
    try {
        const userId = req.decoded?.id;
        
        if (!userId) {
          return SendResponse(
            res,
            HttpResponseCode.UNAUTHORIZED,
            HttpResponseMessage.UNAUTHORIZED
          );
        }
  
        if (!req.file) {
          return SendResponse(
            res,
            HttpResponseCode.BAD_REQUEST,
            "No file uploaded"
          );
        }
        
        const updatedProfile = await this.userService.updateProfilePicture(
          userId,
          req.file
        );
        
        SendResponse(
          res,
          HttpResponseCode.OK,
          HttpResponseMessage.SUCCESS,
          updatedProfile
        );
      } catch (error) {
        next(error);
      }
    }


}