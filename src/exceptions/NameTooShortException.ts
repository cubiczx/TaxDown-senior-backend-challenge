import { CustomError } from "../interfaces/CustomError";

export class NameTooShortException extends Error implements CustomError {
  public statusCode: number;

  /**
   * Constructor for NameTooShortException class.
   * Name must be at least 3 characters long.
   */
  constructor() {
    super("Name must be at least 3 characters long.");
    this.statusCode = 400; // Bad Request
  }
}
