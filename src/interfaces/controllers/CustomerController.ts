import { Request, Response } from "express";
import { CustomerService } from "../../application/CustomerService";
import { isCustomError } from "../CustomError";

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API for managing customers
 */
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  /**
   * @swagger
   * /customers:
   *   post:
   *     tags: [Customers]
   *     summary: Create a new customer
   *     description: Creates a new customer in the system.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *               email:
   *                 type: string
   *                 example: "john.doe@example.com"
   *               availableCredit:
   *                 type: number
   *                 example: 1000
   *     responses:
   *       201:
   *         description: Customer created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "1"
   *                 name:
   *                   type: string
   *                   example: "John Doe"
   *                 email:
   *                   type: string
   *                   example: "john.doe@example.com"
   *                 availableCredit:
   *                   type: number
   *                   example: 1000
   *       400:
   *         description: Invalid input or validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *               examples:
   *                 NameTooShortException_name:
   *                   summary: Name Too Short for name
   *                   value: { "message": "Name too short, must be at least 3 characters", "statusCode": 400 }
   *                 InvalidTypeException_name:
   *                   summary: Invalid Type for name
   *                   value: { "message": "Invalid type for property name: expected string, but received number.", "statusCode": 400 }
   *                 InvalidTypeException_email:
   *                   summary: Invalid Type for email
   *                   value: { "message": "Invalid type for property email: expected string, but received number.", "statusCode": 400 }
   *                 InvalidTypeException_amount:
   *                   summary: Invalid Type fort for amount
   *                   value: { "message": "Invalid type for property amount: expected number, but received string.", "statusCode": 400 }
   *                 InvalidEmailFormat:
   *                   summary: Invalid email format
   *                   value: { "message": "Invalid email format.", "statusCode": 400 }
   *                 EmptyName:
   *                   summary: Name cannot be empty
   *                   value: { "message": "Name cannot be empty.", "statusCode": 400 }
   *                 NameTooShortException_name:
   *                   summary: Name Too Short for name
   *                   value: { "message": "Name too short, must be at least 3 characters", "statusCode": 400 }
   *                 NegativeCreditAmountException:
   *                   summary: Credit amount cannot be negative
   *                   value: { "message": "Credit amount cannot be negative.", "statusCode": 400 }
   * 
   *       409:
   *         description: Email already in use
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Email is already in use"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "An error occurred when creating customer:"
   */
  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, availableCredit } = req.body;
      const customer = await this.customerService.create(
        name,
        email,
        availableCredit
      );
      res.status(201).json(customer);
    } catch (error) {
      const errorMessage = "An error occurred when creating customer:";
      if (isCustomError(error)) {
        //console.error(errorMessage, error.message);
        res.status(error.statusCode).json({
          error: error.message,
        });
      } else {
        //console.error(errorMessage, (error as Error).message);
        res.status(500).json({
          error: errorMessage + (error as Error).message,
        });
      }
    }
  }

  /**
   * @swagger
   * /customers:
   *   get:
   *     tags: [Customers]
   *     summary: Retrieve a list of all customers
   *     responses:
   *       200:
   *         description: A list of customers
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     description: Customer ID
   *                     example: "123456"
   *                   name:
   *                     type: string
   *                     description: Customer name
   *                     example: "Xavier Palacín Ayuso"
   *                   email:
   *                     type: string
   *                     description: Customer email
   *                     example: "john.doe@example.com"
   *                   availableCredit:
   *                     type: number
   *                     description: Available credit for the customer
   *                     example: 500.0
   *       500:
   *         description: An unknown error occurred while retrieving customers
   *         content:
   *           application/json:
   *             example:
   *               error: "An unknown error occurred when retrieving customers: <error message>"
   */
  async listCustomers(req: Request, res: Response): Promise<void> {
    try {
      const customers = await this.customerService.list();
      res.status(200).json(customers);
    } catch (error) {
      const errorMessage = "An error occurred when retrieving customers:";
      //console.error(errorMessage, (error as Error).message);
      res.status(500).json({
        error: errorMessage + (error as Error).message,
      });
    }
  }

  /**
   * @swagger
   * /customers/{id}:
   *   get:
   *     tags: [Customers]
   *     summary: Retrieve a customer by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the customer to retrieve
   *         schema:
   *           type: string
   *           example: "123456"
   *     responses:
   *       200:
   *         description: The requested customer
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Customer ID
   *                   example: "123456"
   *                 name:
   *                   type: string
   *                   description: Customer name
   *                   example: "Xavier Palacín Ayuso"
   *                 email:
   *                   type: string
   *                   description: Customer email
   *                   example: "john.doe@example.com"
   *                 availableCredit:
   *                   type: number
   *                   description: Available credit for the customer
   *                   example: 500.0
   *       404:
   *         description: Customer not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Customer not found."
   *                 statusCode:
   *                   type: integer
   *                   example: 404
   *       500:
   *         description: An unknown error occurred while retrieving the customer
   *         content:
   *           application/json:
   *             example:
   *               message: "Internal Server Error"
   */
  async getCustomerById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
  
    try {
      const customer = await this.customerService.findById(id);
      if (!customer) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }
      res.status(200).json(customer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  /**
   * @swagger
   * /customers/{id}:
   *   put:
   *     tags: [Customers]
   *     summary: Update a customer
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the customer to update
   *         schema:
   *           type: string
   *           example: "123456"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Customer's name, must be valid and non-empty
   *                 example: "Xavier Palacín Ayuso"
   *               email:
   *                 type: string
   *                 description: Customer's email, must be in valid format (can be same as before if not updating email)
   *                 example: "john.doe@example.com"
   *               availableCredit:
   *                 type: number
   *                 description: Updated available credit, must be a valid number and cannot be negative
   *                 example: 1000.0
   *     responses:
   *       200:
   *         description: Customer updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Customer ID
   *                 name:
   *                   type: string
   *                   description: Customer name
   *                 email:
   *                   type: string
   *                   description: Customer email
   *                 availableCredit:
   *                   type: number
   *                   description: Customer's available credit
   *       400:
   *         description: Invalid input for parameters
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Invalid type for property name: expected string, but received number."
   *                 statusCode:
   *                   type: integer
   *                   example: 400
   *               examples:
   *                 InvalidTypeException_name:
   *                   summary: Invalid type for name
   *                   value: { "message": "Invalid type for property name: expected string, but received number.", "statusCode": 400 }
   *                 EmptyNameException:
   *                   summary: Empty name provided
   *                   value: { "message": "Name cannot be empty", "statusCode": 400 }
   *                 NameTooShortException:
   *                   summary: Name too short
   *                   value: { "message": "Name must be at least 3 characters", "statusCode": 400 }
   *                 InvalidEmailFormatException:
   *                   summary: Invalid email format
   *                   value: { "message": "Email is not in a valid format", "statusCode": 400 }
   *                 InvalidTypeException_amount:
   *                   summary: Invalid type for available credit
   *                   value: { "message": "Invalid type for property availableCredit: expected number, but received string.", "statusCode": 400 }
   *       404:
   *         description: Customer not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Customer not found."
   *                 statusCode:
   *                   type: integer
   *                   example: 404
   *       409:
   *         description: Email already in use
   *         content:
   *           application/json:
   *             example:
   *               error: "Email already in use."
   *       500:
   *         description: An error occurred
   *         content:
   *           application/json:
   *             example:
   *               error: "An error occurred when updating customer: <error message>"
   */
  async updateCustomer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, email, availableCredit } = req.body;
    try {
      const updatedCustomer = await this.customerService.update(
        id,
        name,
        email,
        availableCredit
      );
      res.status(200).json(updatedCustomer);
    } catch (error) {
      const errorMessage = "An error occurred when updating customer:";
      if (isCustomError(error)) {
        //console.error(errorMessage, error.message);
        res.status(error.statusCode).json({
          error: error.message,
        });
      } else {
        //console.error(errorMessage, (error as Error).message);
        res.status(500).json({
          error: errorMessage + (error as Error).message,
        });
      }
    }
  }

  /**
   * @swagger
   * /customers/{id}:
   *   delete:
   *     tags: [Customers]
   *     summary: Delete a customer
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the customer to delete
   *         schema:
   *           type: string
   *           example: "123456"
   *     responses:
   *       204:
   *         description: Customer deleted successfully
   *       400:
   *         description: Invalid ID type
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Invalid type for property id: expected string, but received number."
   *                 statusCode:
   *                   type: integer
   *                   example: 400
   *             examples:
   *               InvalidTypeException_id:
   *                 summary: Invalid ID type
   *                 value: { "message": "Invalid type for property id: expected string, but received number.", "statusCode": 400 }
   *       404:
   *         description: Customer not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Customer not found."
   *                 statusCode:
   *                   type: integer
   *                   example: 404
   *       500:
   *         description: An error occurred
   *         content:
   *           application/json:
   *             example:
   *               error: "An error occurred when deleting customer: <error message>"
   */
  async deleteCustomer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await this.customerService.delete(id);
      res.status(204).send();
    } catch (error) {
      const errorMessage = "An error occurred when deleting customer:";
      if (isCustomError(error)) {
        //console.error(errorMessage, error.message);
        res.status(error.statusCode).json({
          error: error.message,
        });
      } else {
        //console.error(errorMessage, (error as Error).message);
        res.status(500).json({
          error: errorMessage + (error as Error).message,
        });
      }
    }
  }

  /**
   * @swagger
   * /customers/credit:
   *   post:
   *     tags: [Customers]
   *     summary: Add credit to a customer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 description: The ID of the customer
   *                 example: "123456"
   *               amount:
   *                 type: number
   *                 description: The amount of credit to add, must be a positive number
   *                 example: 100
   *     responses:
   *       200:
   *         description: Customer credit updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Customer ID
   *                 name:
   *                   type: string
   *                   description: Customer name
   *                 email:
   *                   type: string
   *                   description: Customer email
   *                 availableCredit:
   *                   type: number
   *                   description: Updated available credit
   *       400:
   *         description: Invalid input, such as negative credit or missing ID
   *         content:
   *           application/json:
   *             examples:
   *               missingId:
   *                 summary: Missing customer ID
   *                 value:
   *                   error: "Customer ID is required."
   *               invalidAmountError:
   *                 summary: Invalid credit amount
   *                 value:
   *                   error: "Credit amount must be a positive number."
   *               creditAmountError:
   *                 summary: Negative credit not allowed
   *                 value:
   *                   error: "Credit amount cannot be negative."
   *               invalidTypeError:
   *                 summary: Invalid type for a field
   *                 value:
   *                   error: "Invalid type for property availableCredit: expected number, but received string."
   *       404:
   *         description: Customer not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Customer not found."
   *                 statusCode:
   *                   type: integer
   *                   example: 404
   *       452:
   *         description: Negative credit amount not allowed
   *         content:
   *           application/json:
   *             example:
   *               error: "Credit amount cannot be negative."
   *       500:
   *         description: An unknown error occurred
   *         content:
   *           application/json:
   *             example:
   *               error: "An error occurred when adding credit: <error message>"
   */
  async addCredit(req: Request, res: Response): Promise<void> {
    const { id, amount } = req.body;
    try {
      const updatedCustomer = await this.customerService.addCredit(id, amount);
      res.status(200).json(updatedCustomer);
    } catch (error) {
      const errorMessage = "An error occurred when adding credit:";
      if (isCustomError(error)) {
        //console.error(errorMessage, error.message);
        res.status(error.statusCode).json({
          error: error.message,
        });
      } else {
        //console.error(errorMessage, (error as Error).message);
        res.status(500).json({
          error: errorMessage + (error as Error).message,
        });
      }
    }
  }

  /**
   * @swagger
   * /customers/sortByCredit:
   *   get:
   *     tags: [Customers]
   *     summary: Get customers sorted by available credit
   *     parameters:
   *       - name: order
   *         in: query
   *         description: Sort order (asc for ascending or desc for descending)
   *         required: false
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *     responses:
   *       200:
   *         description: A list of customers sorted by credit
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     description: Customer ID
   *                   name:
   *                     type: string
   *                     description: Customer name
   *                   email:
   *                     type: string
   *                     description: Customer email
   *                   availableCredit:
   *                     type: number
   *                     description: Customer's available credit
   *       400:
   *         description: Invalid sort order provided
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Invalid sort order. Use 'asc' or 'desc'."
   *       500:
   *         description: An error occurred
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "An error occurred while sorting customers by credit: <error message>"
   */
  async sortCustomersByCredit(req: Request, res: Response): Promise<void> {
    const order = req.query.order as string | undefined;

    try {
      const sortedCustomers = await this.customerService.sortCustomersByCredit(
        order
      );
      res.status(200).json(sortedCustomers);
    } catch (error) {
      const errorMessage =
        "An error occurred while sorting customers by credit:";
      if (isCustomError(error)) {
        //console.error(errorMessage, error.message);
        res.status(error.statusCode).json({
          error: error.message,
        });
      } else {
        //console.error(errorMessage, (error as Error).message);
        res.status(500).json({
          error: errorMessage + (error as Error).message,
        });
      }
    }
  }
}
