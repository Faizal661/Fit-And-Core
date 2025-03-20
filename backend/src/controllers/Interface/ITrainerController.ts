import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../../types/trainer.types";

export interface ITrainerController {
  applyTrainer(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
//   approveTrainer(req: Request, res: Response, next: NextFunction): Promise<void>;
//   getTrainerApplications(req: Request, res: Response, next: NextFunction): Promise<void>;
}