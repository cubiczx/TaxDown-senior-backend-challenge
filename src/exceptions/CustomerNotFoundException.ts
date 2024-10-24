import { CustomError } from "../interfaces/CustomError";

export class CustomerNotFoundException extends Error implements CustomError {
  public statusCode: number;

  /**
   * Constructor for CustomerNotFoundException class.
   * Customer not found.
   * statusCode: 404 (Not Found)
   */
  constructor() {
    super("Customer not found.");
    this.statusCode = 404; // Not Found
  }
}
