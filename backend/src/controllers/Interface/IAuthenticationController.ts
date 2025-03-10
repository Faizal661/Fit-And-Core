import { NextFunction, Request, Response } from "express";

export interface IAuthenticationController {
  checkUsernameEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>
  register(req: Request, res: Response, next: NextFunction): Promise<void>
  // login(req: Request, res: Response, next: NextFunction): Promise<void>;
  // logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}
