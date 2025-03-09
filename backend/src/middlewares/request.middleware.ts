import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

const logRequestBoundaries = (req: Request, res: Response, next: NextFunction) => {
  console.log('---- ---- ---- ---- ----- ---- ---- ----');
  next();
};

const requestLogging = () => {
    return [
        logRequestBoundaries,
        morgan("dev")
      ];  
};

export default requestLogging;