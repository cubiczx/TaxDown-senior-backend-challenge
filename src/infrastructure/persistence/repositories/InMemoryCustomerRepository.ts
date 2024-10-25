import { Customer } from "../../../domain/Customer";
import { CustomerRepositoryInterface } from "../../../domain/repositories/CustomerRepositoryInterface";
import { CustomerNotFoundException } from "../../../exceptions/CustomerNotFoundException";

export class InMemoryCustomerRepository implements CustomerRepositoryInterface {
  private customers: Customer[] = [];

  /**
   * Creates a new customer.
   * @param customer The customer to create.
   * @returns A promise that resolves when the customer is created.
   */
  async create(customer: Customer): Promise<Customer> {
    this.customers.push(customer);
    return customer;
  }

  /**
   * Retrieves a list of all customers from the repository.
   * @returns {Promise<Customer[]>} - A list of all customers
   */
  async findAll(): Promise<Customer[]> {
    return this.customers;
  }

  /**
   * Retrieves a customer by ID.
   * @param id The ID of the customer to find.
   * @returns A promise that resolves to the customer if found, or undefined if not.
   */
  async findById(id: string): Promise<Customer | undefined> {
    return this.customers.find((customer) => customer.id === id);
  }

  /**
   * Retrieves a customer by email.
   * @param email The email of the customer to find.
   * @returns A promise that resolves to the customer if found, or undefined if not.
   */
  async findByEmail(email: string): Promise<Customer | undefined> {
    return this.customers.find((customer) => customer.email === email);
  }

  /**
   * Updates a customer in the repository.
   */
  async update(customer: Customer): Promise<Customer> {
    const index = this.customers.findIndex((c) => c.id === customer.id);
    if (index !== -1) {
      this.customers[index] = customer;
      return customer;
    }
    throw new CustomerNotFoundException();
  }

  /**
   * Deletes a customer by ID.
   * @param id The ID of the customer to delete.
   * @returns A promise that resolves when the customer is deleted.
   */
  async delete(id: string): Promise<void> {
    this.customers = this.customers.filter((customer) => customer.id !== id);
  }

  /**
   * Retrieves a list of customers with available credit greater than or equal to the given amount.
   * @param minCredit The minimum available credit to filter by.
   * @returns A promise that resolves to a list of customers with available credit greater than or equal to the given amount.
   */
  async findByAvailableCredit(minCredit: number): Promise<Customer[]> {
    return this.customers.filter(
      (customer) => customer.availableCredit >= minCredit
    );
  }

  /**
   * Clears all customers from the repository.
   * This is mainly for testing purposes.
   * @returns A promise that resolves when all customers have been cleared.
   */
  public async clear(): Promise<void> {
    this.customers = [];
  }
}
