import { CustomError } from "../interfaces/CustomError";

export class EmailAlreadyInUseException extends Error implements CustomError {
  public statusCode: number;

  /**
   * Constructor for EmailAlreadyInUseException class.
   * Email is already in use.
   * statusCode: 409 (Conflict)
   */
  constructor() {
    super("Email is already in use.");
    this.statusCode = 409; // Conflict
  }
}
