import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/CustomError";
import { HttpResCode,HttpResMsg } from "../constants/http-response.constants";

export const authorizeRoles = (roles: Array<"user" | "trainer" | "admin">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.decoded;

    if (!decoded) {
      throw new CustomError(HttpResMsg.UNAUTHORIZED, HttpResCode.UNAUTHORIZED);
    }

    if (!roles.includes(decoded.role)) {
      throw new CustomError(HttpResMsg.FORBIDDEN, HttpResCode.FORBIDDEN);
    }

    next();
  };
};
