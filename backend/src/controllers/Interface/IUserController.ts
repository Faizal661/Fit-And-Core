import { NextFunction, Request, Response } from "express";

export interface IUserController {
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleBlockStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void>; 
  changePassword(req: Request, res: Response, next: NextFunction): Promise<void>; 

}