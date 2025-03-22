import { BaseError } from "./BaseError";

export class CustomError extends BaseError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
  }
}
