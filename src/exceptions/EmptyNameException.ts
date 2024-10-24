import { CustomError } from "../interfaces/CustomError";

export class EmptyNameException extends Error implements CustomError {
  public statusCode: number;

  /**
   * Constructor for EmptyNameException class.
   * Name cannot be empty.
   * statusCode: 400 (Bad Request)
   */
  constructor() {
    super("Name cannot be empty.");
    this.statusCode = 400; // Bad Request
  }
}
