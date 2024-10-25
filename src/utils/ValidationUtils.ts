import { CustomerRepositoryInterface } from "../domain/repositories/CustomerRepositoryInterface";
import { InvalidEmailFormatException } from "../exceptions/InvalidEmailFormatException";
import { EmailAlreadyInUseException } from "../exceptions/EmailAlreadyInUseException";
import { CustomerNotFoundException } from "../exceptions/CustomerNotFoundException";
import { NegativeCreditAmountException } from "../exceptions/NegativeCreditAmountException";
import { EmptyNameException } from "../exceptions/EmptyNameException";
import { NameTooShortException } from "../exceptions/NameTooShortException";
import { InvalidTypeException } from "../exceptions/InvalidTypeException";
import { InvalidSortOrderException } from "../exceptions/InvalidSortOrderException";

export class ValidationUtils {
  /**
   * Validates the provided name to ensure it is not empty and meets the minimum length requirement.
   * Throws EmptyNameException if the name is empty.
   * Throws NameTooShortException if the name is shorter than 3 characters.
   */
  static validateName(name: string): void {
    if (typeof name !== "string") {
      throw new InvalidTypeException("name", "string", name);
    }
    if (!name || name.trim().length === 0) {
      throw new EmptyNameException();
    }
    if (name.length < 3) {
      throw new NameTooShortException();
    }
  }

  /**
   * Validates the provided email to ensure it is in the correct format and not already in use.
   * Throws InvalidEmailFormatException if the email is not in the correct format.
   * Throws EmailAlreadyInUseException if the email is already in use.
   * @param {string} email - The email to validate
   * @param {CustomerRepositoryInterface} customerRepository - The repository to check for existing customers
   * @returns {Promise<void>} - Resolves if the email is valid, rejects with an appropriate error if not
   */
  static async validateEmail(
    email: string,
    customerRepository: CustomerRepositoryInterface
  ): Promise<void> {
    if (typeof email !== "string") {
      throw new InvalidTypeException("email", "string", email);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new InvalidEmailFormatException();
    }

    const existingCustomer = await customerRepository.findByEmail(email);
    if (existingCustomer) {
      throw new EmailAlreadyInUseException();
    }
  }

  /**
   * Validates the existence of a customer with the given ID in the customer repository.
   * Throws CustomerNotFoundException if the customer does not exist.
   */
  static async validateCustomerExists(
    id: string,
    customerRepository: CustomerRepositoryInterface
  ): Promise<void> {
    if (typeof id !== "string") {
      throw new InvalidTypeException("id", "string", id);
    }
    const existingCustomer = await customerRepository.findById(id);
    if (!existingCustomer) {
      throw new CustomerNotFoundException();
    }
  }

  /**
   * Validates the given credit amount to ensure it is a positive number.
   * Throws InvalidCreditAmountException if the credit amount is not a number.
   * Throws NegativeCreditAmountException if the credit amount is negative.
   * @param {number} amount - The amount of credit to validate
   */
  static validateAvailableCredit(amount: number): void {
    if (typeof amount !== "number" || isNaN(amount)) {
      throw new InvalidTypeException("amount", "number", amount);
    }
    if (amount < 0) {
      throw new NegativeCreditAmountException();
    }
  }

  /**
   * Validates the given sort order to ensure it is either "asc" or "desc".
   * Returns "desc" if the order is undefined.
   * Throws InvalidSortOrderException if the order is not valid.
   * @param {string | undefined} order - The order to validate
   * @returns {"asc" | "desc"} - The validated order
   */
  static validateSortOrder(order: string | undefined): "asc" | "desc" {
    if (order === undefined) {
      return "desc";
    }
    if (order === "asc" || order === "desc") {
      return order as "asc" | "desc";
    }
    throw new InvalidSortOrderException();
  }
}
