import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpResCode, HttpResMsg } from "../../constants/Response.constants";
import { IAdminController } from "../Interface/IAdminController";
import { IAdminService } from "../../services/Interface/IAdminService";
import { SendResponse } from "mern.common";

import dotenv from "dotenv";
dotenv.config();

@injectable()
export default class AdminController implements IAdminController {
  private adminService: IAdminService;

  constructor(
    @inject("AdminService")
    adminService: IAdminService
  ) {
    this.adminService = adminService;
  }

  async userCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const count = await this.adminService.userCount();
      SendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        count: count,
        percentChange: 0,
      });
    } catch (error) {
      next(error);
    }
  }

  async trainerCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const count = await this.adminService.trainerCount();
      SendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        count: count,
        percentChange: 0,
      });
    } catch (error) {
      next(error);
    }
  }
}
