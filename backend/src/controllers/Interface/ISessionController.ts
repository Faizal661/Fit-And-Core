import { NextFunction, Request, Response } from "express";

export interface ISessionController {
    createAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTrainerAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
  }