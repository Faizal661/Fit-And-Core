import { Response } from "express";

/**
 * Sends a structured JSON response.
 * @param res - Express response object.
 * @param status - HTTP status code.
 * @param message - Response message.
 * @param data - Optional response data.
 * @returns Express response.
 */
export function sendResponse<T>(
  res: Response,
  status: number,
  message: string,
  data?: T
): Response {
  return res.status(status).json(data ? { message, ...data } : { message });
}
