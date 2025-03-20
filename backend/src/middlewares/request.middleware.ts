import morgan from "morgan";
import { Request, Response, NextFunction } from "express";

const requestLogging = () => {
  return [logRequestBoundaries, morgan("dev")];
};

const logRequestBoundaries = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("---- ---- ---- ---- ----- ---- ---- ----");
  next();
};

export default requestLogging;