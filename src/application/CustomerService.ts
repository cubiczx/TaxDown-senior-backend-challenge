import { CustomerRepositoryInterface } from "../domain/repositories/CustomerRepositoryInterface";
import { Customer } from "../domain/Customer";
import { ValidationUtils } from "../utils/ValidationUtils";
import { CustomerNotFoundException } from "../exceptions/CustomerNotFoundException";

export class CustomerService {
  constructor(private customerRepository: CustomerRepositoryInterface) {}

  // Generates a unique ID for new customers
  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Creates a new customer with the given name, email, and available credit.
   * Performs input validation and checks that the email is not already in use.
   * @param {string} name - The customer's name
   * @param {string} email - The customer's email
   * @param {number} availableCredit - The customer's available credit
   * @returns {Promise<Customer>} - The newly created customer
   */
  async create(
    name: string,
    email: string,
    availableCredit: number
  ): Promise<Customer> {
    ValidationUtils.validateName(name);
    ValidationUtils.validateAvailableCredit(availableCredit);
    await ValidationUtils.validateEmail(email, this.customerRepository);

    // Create a new Customer object
    const customer = new Customer(
      this.generateUniqueId(),
      name,
      email,
      availableCredit
    );

    // Save the new customer to the repository
    await this.customerRepository.create(customer);
    return customer;
  }

  /**
   * Retrieves a list of all customers from the repository
   * @returns {Promise<Customer[]>} - A list of all customers
   */
  async list(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  /**
   * Updates a customer by ID with the given name, email, and/or available credit.
   * Performs input validation and checks that the email is not already in use.
   * @param {string} id - ID of the customer to update
   * @param {string} [name] - The customer's new name
   * @param {string} [email] - The customer's new email
   * @param {number} [availableCredit] - The customer's new available credit
   * @returns {Promise<Customer>} - The updated customer
   */
  async update(
    id: string,
    name?: string,
    email?: string,
    availableCredit?: number
  ): Promise<Customer> {
    await ValidationUtils.validateCustomerExists(id, this.customerRepository);

    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException();
    }

    // Validate and update name if provided
    if (name !== undefined) {
      ValidationUtils.validateName(name);
      customer.name = name; // Update the customer's name
    }

    // Validate and update email if provided
    if (email !== undefined && customer.email !== email) {
      await ValidationUtils.validateEmail(email, this.customerRepository);
      customer.email = email; // Update the customer's email
    }

    // Validate and update availableCredit if provided
    if (availableCredit !== undefined) {
      ValidationUtils.validateAvailableCredit(availableCredit);
      customer.availableCredit = availableCredit; // Update the customer's available credit
    }

    // Save changes
    await this.customerRepository.update(customer);
    return customer;
  }

  /**
   * Deletes a customer by ID
   * @param {string} id - ID of the customer to delete
   * @returns {Promise<void>} - Resolves when the customer is deleted
   */
  async delete(id: string): Promise<void> {
    await ValidationUtils.validateCustomerExists(id, this.customerRepository);

    await this.customerRepository.delete(id);
  }

  /**
   * Adds the given amount to the customer's available credit.
   * @param {string} id - ID of the customer to add credit to
   * @param {number} amount - Amount of credit to add (must be positive)
   * @returns {Promise<Customer | null>} - The updated customer if successful, or null if the customer could not be found
   */
  async addCredit(id: string, amount: number): Promise<Customer | null> {
    await ValidationUtils.validateCustomerExists(id, this.customerRepository);
    ValidationUtils.validateAvailableCredit(amount);

    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException();
    }

    customer.availableCredit += amount;

    // Update the customer's credit in the repository
    await this.customerRepository.update(customer);
    return customer;
  }

  /**
   * Retrieves a list of all customers sorted by their available credit.
   * @param {string} [order="desc"] - The order to sort the customers by (either "asc" or "desc")
   * @returns {Promise<Customer[]>} - A promise that resolves to an array of customers sorted by available credit
   */
  async sortCustomersByCredit(
    order: string | undefined = "desc"
  ): Promise<Customer[]> {
    const validOrder = ValidationUtils.validateSortOrder(order);
    const customers = await this.customerRepository.findAll();

    return customers.sort((a, b) => {
      if (validOrder === "asc") {
        return a.availableCredit - b.availableCredit;
      } else {
        return b.availableCredit - a.availableCredit;
      }
    });
  }
}
