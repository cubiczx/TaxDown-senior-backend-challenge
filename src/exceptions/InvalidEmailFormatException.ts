import { CustomError } from "../interfaces/CustomError";

export class InvalidEmailFormatException extends Error implements CustomError {
  public statusCode: number;

  /**
   * Constructor for InvalidEmailFormatException class.
   * Email format is invalid.
   * statusCode: 400 (Bad Request)
   */
  constructor() {
    super("Invalid email format.");
    this.statusCode = 400; // Bad Request
  }
}
