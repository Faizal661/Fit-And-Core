import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "mern.common";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string | any;
    }
  }
}

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      throw new UnauthorizedError("Access denied. No token provided.");
    }

    try {
      const decoded = jwt.verify(accessToken!, ACCESS_TOKEN_SECRET);
      console.log('accessToken',decoded);
      req.user = decoded;
      next();
    } catch (tokenError) {
      throw new UnauthorizedError("Invalid or expired token.");
    }
  } catch (error) {
    next(error);
  }
};

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token required.");
    }
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      req.user = decoded;
      console.log('refreshToken',decoded)
      next();
    } catch (tokenError) {
      throw new UnauthorizedError("Invalid or expired refresh token.");
    }
  } catch (error) {
    next(error);
  }
};
