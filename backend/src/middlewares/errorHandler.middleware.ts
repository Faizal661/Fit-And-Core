import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.utils";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
};

export default errorHandler;
 