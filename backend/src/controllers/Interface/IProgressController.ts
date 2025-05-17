import { NextFunction, Request, Response } from "express";

export interface IProgressController {
    getMyProgressions(req: Request, res: Response, next: NextFunction): Promise<void>;
    addNewProgress(req: Request, res: Response, next: NextFunction): Promise<void>;
}