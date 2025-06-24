import { BaseError } from "./BaseError";

class CustomError extends BaseError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
  }
}

export default CustomError;
