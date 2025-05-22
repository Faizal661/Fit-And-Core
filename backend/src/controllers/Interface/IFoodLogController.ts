import { NextFunction, Request, Response } from "express";

export interface IFoodLogController {
    getFoodLogsByDate(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFoodLogDatesByMonth(req: Request, res: Response, next: NextFunction): Promise<void>;
    createFoodLog(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteFoodLog( req: Request, res: Response, next: NextFunction ): Promise<void> 
}