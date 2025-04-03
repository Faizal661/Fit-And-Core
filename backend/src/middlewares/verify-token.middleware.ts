import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import jwt from "jsonwebtoken";
import { IJwtDecoded } from "../types/auth.types";
import { CustomError } from "../errors/CustomError";
import { HttpResCode } from "../constants/response.constants";
import { env } from "../config/env.config";
import { generateAccessToken } from "../utils/token.util";
import { IAuthRepository } from "../repositories/Interface/IAuthRepository";

declare global {
  namespace Express {
    interface Request {
      decoded?: IJwtDecoded;
    }
  }
}

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      throw new CustomError(
        "Access denied. No token provided.",
        HttpResCode.UNAUTHORIZED
      );
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        env.ACCESS_TOKEN_SECRET
      ) as IJwtDecoded;

      req.decoded = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          throw new CustomError(
            "Refresh token required.", 
            HttpResCode.UNAUTHORIZED
          );
        }

        try {
          const decodedRefresh = jwt.verify(
            refreshToken,
            env.REFRESH_TOKEN_SECRET
          ) as IJwtDecoded;

          const authRepository = container.resolve<IAuthRepository>('AuthRepository');

          const user = await authRepository.findByEmail(decodedRefresh.email);

          if (!user) {
            throw new CustomError("User not found.", HttpResCode.UNAUTHORIZED);
          }

          const newAccessToken = generateAccessToken(user);

          res.setHeader("x-access-token", newAccessToken);

          req.decoded = decodedRefresh;
          next();
        } catch (refreshError) {
          throw new CustomError(
            "Invalid or expired refresh token.",
            HttpResCode.UNAUTHORIZED
          );
        }
      } else {
        throw new CustomError(
          "Invalid access token.",
          HttpResCode.UNAUTHORIZED
        );
      }
    }
  } catch (error) {
    next(error);
  }
};
