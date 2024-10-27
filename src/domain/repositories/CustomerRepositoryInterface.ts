import { Customer } from "../Customer";

/**
 * Interface for Customer Repository
 * Defines the operations that can be performed on Customer entities.
 */
export interface CustomerRepositoryInterface {
  /**
   * Creates a new customer in the repository.
   * @param customer - The customer to create.
   * @returns A promise that resolves to the created customer.
   */
  create(customer: Customer): Promise<Customer>;

  /**
   * Retrieves all customers from the repository.
   * @returns A promise that resolves to an array of customers.
   */
  findAll(): Promise<Customer[]>;

  /**
   * Finds a customer by their ID.
   * @param id - The ID of the customer to find.
   * @returns A promise that resolves to the found customer or undefined if not found.
   */
  findById(id: string): Promise<Customer | undefined>;

  /**
   * Finds a customer by their email address.
   * @param email - The email address of the customer to find.
   * @returns A promise that resolves to the found customer or undefined if not found.
   */
  findByEmail(email: string): Promise<Customer | undefined>;

  /**
   * Updates an existing customer in the repository.
   * @param customer - The customer with updated information.
   * @returns A promise that resolves to the updated customer.
   */
  update(customer: Customer): Promise<Customer>;

  /**
   * Deletes a customer by their ID.
   * @param id - The ID of the customer to delete.
   * @returns A promise that resolves when the customer is deleted.
   */
  delete(id: string): Promise<void>;

  /**
   * Finds customers by their available credit.
   * @param minCredit - The minimum available credit for the customers to find.
   * @returns A promise that resolves to an array of customers meeting the criteria.
   */
  findByAvailableCredit(minCredit: number): Promise<Customer[]>;

  /**
   * Clears all customers from the repository.
   * @returns A promise that resolves when the repository is cleared.
   */
  clear(): Promise<void>;
}
