import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {
  UnauthorizedError,
} from "mern.common";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    // const 

    if (!accessToken) {
      throw new UnauthorizedError("Access denied. No token provided.");
    }
    const decoded = jwt.verify(accessToken!, ACCESS_TOKEN_SECRET);
    // req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
