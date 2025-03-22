import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/BaseError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  // Clear cookie In case of an UnAuthorized Access
  if (
    err.message === "Refresh token required." ||
    err.message === "Invalid or expired refresh token."
  ) {
    console.log("Cookie cleared inside the error Handler");
    res.clearCookie("refreshToken");
  }

  console.log("error handler message:::");
  // Log unexpected errors for debugging
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Custom Error Handling
  if (err instanceof BaseError) {
    console.log("custoem error handler worked inside the error handler");
    res.status(err.statusCode).json({ message: err.message });
  } else {
    // Handle server errors
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message || "Something went wrong.",
    });
  }
};
