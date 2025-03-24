import jwt from "jsonwebtoken";
import { IUserModel } from "../models/user.models";
import { env } from "../config/env.config";

export const generateAccessToken = (user: IUserModel) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: IUserModel) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};
