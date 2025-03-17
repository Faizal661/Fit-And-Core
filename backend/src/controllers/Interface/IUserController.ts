import { NextFunction, Request, Response } from "express";

export interface IUserController {
  getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}