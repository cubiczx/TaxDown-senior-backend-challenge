import { CustomError } from "../interfaces/CustomError";

export class NegativeCreditAmountException
  extends Error
  implements CustomError
{
  public statusCode: number;

  /**
   * Constructor for NegativeCreditAmountException class.
   * Credit amount cannot be negative.
   * statusCode: 452 (Custom status code)
   */
  constructor() {
    super("Credit amount cannot be negative.");
    this.statusCode = 452; // Custom status code
  }
}
