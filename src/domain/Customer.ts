import { ValidationUtils } from "../utils/ValidationUtils";

export class Customer {
  /**
   * Creates a new Customer object.
   * @param {string} id The customer's unique identifier.
   * @param {string} name The customer's name.
   * @param {string} email The customer's email address.
   * @param {number} [availableCredit=0] The customer's available credit.
   */
  constructor(
    private readonly id: string,
    private name: string,
    private email: string,
    private availableCredit: number = 0
  ) {
    this.validate();
  }

  /**
   * Gets the customer's unique identifier.
   * @returns {string} The customer's unique identifier.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Gets the customer's name.
   * @returns {string} The customer's name.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Gets the customer's email address.
   * @returns {string} The customer's email address.
   */
  public getEmail(): string {
    return this.email;
  }

  /**
   * Gets the customer's available credit.
   * @returns {number} The customer's available credit.
   */
  public getAvailableCredit(): number {
    return this.availableCredit;
  }

  /**
   * Sets the customer's name after validating it.
   * @param {string} name The customer's new name
   * @throws {EmptyNameException} If the name is empty
   * @throws {NameTooShortException} If the name's length is shorter than 3
   */
  public setName(name: string): void {
    ValidationUtils.validateName(name);
    this.name = name;
  }

  /**
   * Sets the customer's email address after validating the format.
   * @param {string} email The customer's new email address
   * @throws {InvalidEmailFormatException} If the email is not in a valid format
   */
  public setEmail(email: string): void {
    ValidationUtils.validateEmailFormat(email);
    this.email = email;
  }

  /**
   * Sets the customer's available credit after validating the value.
   * @throws {InvalidTypeException} if amount is not a number
   * @param availableCredit The new available credit for the customer
   */
  public setAvailableCredit(availableCredit: number): void {
    ValidationUtils.validateAmount(availableCredit);
    this.availableCredit = availableCredit;
  }
  
  /**
   * Adds the given amount to the customer's available credit.
   * @param {number} amount - The amount of credit to add (must be positive)
   * @throws InvalidTypeException if availableCredit is not a number
   * @throws NegativeCreditAmountException if availableCredit is negative
   */
  public addCredit(amount: number): void {
    ValidationUtils.validateAvailableCredit(amount);
    this.availableCredit += amount;
  }

  /**
   * Validates the customer's name, email format, and available credit.
   * Ensures that the name is not empty and meets the minimum length requirement,
   * the email is in a valid format, and the available credit is a positive number.
   * @throws EmptyNameException if the name is empty.
   * @throws NameTooShortException if the name is shorter than 3 characters.
   * @throws InvalidEmailFormatException if the email is not in a valid format.
   * @throws InvalidCreditAmountException if the available credit is not a number.
   * @throws NegativeCreditAmountException if the available credit is negative.
   */
  private validate(): void {
    ValidationUtils.validateName(this.name);
    ValidationUtils.validateEmailFormat(this.email);
    ValidationUtils.validateAvailableCredit(this.availableCredit);
  }
}
