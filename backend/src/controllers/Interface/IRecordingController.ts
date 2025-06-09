import { NextFunction, Request, Response } from "express";

export interface IRecordingController {
  uploadRecording(req: Request, res: Response, next: NextFunction): Promise<void>;  
}