import morgan from "morgan";
import logger from "../utils/logger.utils";
import { Request, Response, NextFunction } from "express";

const requestLogging = () => {
  return [logRequestBoundaries, morgan("dev")];
};

// Middleware to log all incoming requests
const winstonLogger=(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} ${res.statusCode} - ${req.ip} - ${duration}ms`);
  });

  next();
};


const logRequestBoundaries = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('request-body=>',req.body)
  console.log('request-params=>',req.params)
  console.log('request-query=>',req.query)
  // console.log('request-headers=>',req.headers) 
  console.log("---- ---- ---- ---- ----- ---- ---- ----");
  next();
};

export default requestLogging;