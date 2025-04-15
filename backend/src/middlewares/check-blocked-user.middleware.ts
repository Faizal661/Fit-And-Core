import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { CustomError } from "../errors/CustomError";
import { HttpResCode, HttpResMsg } from "../constants/http-response.constants";
import { IAuthRepository } from "../repositories/Interface/IAuthRepository";

export const checkBlockedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decoded = req.decoded;

    if (!decoded) {
      throw new CustomError(HttpResMsg.UNAUTHORIZED, HttpResCode.UNAUTHORIZED);
    }
    const authRepository = container.resolve<IAuthRepository>("AuthRepository");

    const user = await authRepository.findByEmail(decoded.email);

    if (!user) {
      throw new CustomError(HttpResMsg.USER_NOT_FOUND, HttpResCode.NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new CustomError(HttpResMsg.ACCOUNT_BLOCKED, HttpResCode.FORBIDDEN);
    }

    next();
  } catch (error) {
    next(error);
  }
};
