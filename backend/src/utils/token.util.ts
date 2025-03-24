import jwt from "jsonwebtoken";
import { IUserModel } from "../models/user.models";
import { env } from "../config/env.config";

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (user: IUserModel) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: IUserModel) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};
