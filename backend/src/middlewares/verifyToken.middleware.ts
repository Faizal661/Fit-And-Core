import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "mern.common";
import dotenv from "dotenv";
import { IJwtDecoded } from "../types/auth.types";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

declare global {
  namespace Express {
    interface Request {
      decoded?: IJwtDecoded;
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
      const decoded = jwt.verify(accessToken!, ACCESS_TOKEN_SECRET) as IJwtDecoded;
      req.decoded = decoded;
      next();
    } catch (tokenError) {
      throw new UnauthorizedError("Invalid or expired access token.");
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
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as IJwtDecoded;
      req.decoded = decoded;
      next();
    } catch (tokenError) {
      throw new UnauthorizedError("Invalid or expired refresh token.");
    }
  } catch (error) {
    next(error);
  }
};
