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
    await ValidationUtils.validateEmail(email, this.customerRepository);
    ValidationUtils.validateAvailableCredit(availableCredit);

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
   * Updates a customer's information with validation
   * @param {string} id - The customer's ID
   * @param {string} name - The customer's name
   * @param {string} email - The customer's email
   * @param {number} availableCredit - The customer's available credit
   * @returns {Promise<Customer | null>} - The updated customer if successful, or null if not found
   */
  async update(
    id: string,
    name: string,
    email: string,
    availableCredit: number
  ): Promise<Customer> {
    await ValidationUtils.validateCustomerExists(id, this.customerRepository);

    // Fetch the customer (at this point, we know it exists)
    const customer = await this.customerRepository.findById(id);

    // Check if the customer was found (should not be undefined here)
    if (!customer) {
      throw new CustomerNotFoundException();
    }

    // Check if email needs validation (only if email is changed)
    if (customer.email !== email) {
        await ValidationUtils.validateEmail(email, this.customerRepository);
    }
    ValidationUtils.validateName(name);
    ValidationUtils.validateAvailableCredit(availableCredit);

    // Update customer
    customer.name = name;
    customer.email = email;
    customer.availableCredit = availableCredit;

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
   * Sorts customers by available credit in the given order
   * @param {string} [order="desc"] - Sort order, either "asc" for ascending or "desc" for descending
   * @returns {Promise<Customer[]>} - An array of customers sorted by available credit
   */
  async sortCustomersByCredit(
    order: "asc" | "desc" = "desc"
  ): Promise<Customer[]> {
    const customers = await this.customerRepository.findAll();

    return customers.sort((a, b) => {
      if (order === "asc") {
        return a.availableCredit - b.availableCredit;
      } else {
        return b.availableCredit - a.availableCredit;
      }
    });
  }
}
