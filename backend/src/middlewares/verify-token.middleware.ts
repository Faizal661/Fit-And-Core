import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IJwtDecoded } from "../types/auth.types";
import { CustomError } from "../errors/CustomError";
import { HttpResCode } from "../constants/response.constants";
import { env } from "../config/env.config";

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET!;

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
      throw new CustomError("Access denied. No token provided.",HttpResCode.UNAUTHORIZED);
    }
    try {
      const decoded = jwt.verify(accessToken!, ACCESS_TOKEN_SECRET) as IJwtDecoded;
      req.decoded = decoded;
      next();
    } catch (tokenError) {
      throw new CustomError("Invalid or expired access token.",HttpResCode.UNAUTHORIZED);
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
      throw new CustomError("Refresh token required.",HttpResCode.UNAUTHORIZED);
    }
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as IJwtDecoded;
      req.decoded = decoded;
      next();
    } catch (tokenError) {
      throw new CustomError("Invalid or expired refresh token.",HttpResCode.UNAUTHORIZED);
    }
  } catch (error) {
    next(error);
  }
};
