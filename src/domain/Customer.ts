export class Customer {
  /**
   * Creates a new Customer object
   * @param {string} id - Unique identifier for the customer
   * @param {string} name - The customer's name
   * @param {string} email - The customer's email
   * @param {number} [availableCredit=0] - The customer's available credit
   */
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public availableCredit: number = 0
  ) {}
}
