import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUserModel } from "../models/user.models";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

export const generateAccessToken = (user: IUserModel) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "5s" }
  );
};

export const generateRefreshToken = (user: IUserModel) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "5s" }
  );
};
