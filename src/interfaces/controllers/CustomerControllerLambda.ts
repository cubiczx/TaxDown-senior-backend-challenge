import { Request, Response } from "express";
import { CustomerService } from "../../application/CustomerService";
import { isCustomError } from "../CustomError";
import { APIGatewayProxyResult } from "aws-lambda";

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API for managing customers
 */
export class CustomerControllerLambda {
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
  async createCustomerLambda(req: any): Promise<APIGatewayProxyResult> {
    try {
      const { name, email, availableCredit } = JSON.parse(req.body);
      const customer = await this.customerService.create(
        name,
        email,
        availableCredit
      );
      return {
        statusCode: 201,
        body: JSON.stringify(customer),
      };
    } catch (error) {
      return this.handleErrorLambda(
        error,
        "An error occurred when creating customer:"
      );
    }
  }

  /**
   * @swagger
   * /customers:
   *   get:
   *     tags: [Customers]
   *     summary: List all customers
   *     description: Retrieves a list of all customers in the system.
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
  async listCustomersLambda(req: any): Promise<APIGatewayProxyResult> {
    try {
      const customers = await this.customerService.list();
      return {
        statusCode: 200,
        body: JSON.stringify(customers),
      };
    } catch (error) {
      return this.handleErrorLambda(
        error,
        "An unknown error occurred when retrieving customers:"
      );
    }
  }

  /**
   * @swagger
   * /customers/{id}:
   *   get:
   *     tags: [Customers]
   *     summary: Retrieve a customer by ID
   *     description: Retrieves a specific customer by their ID.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The ID of the customer to retrieve
   *         schema:
   *           type: string
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
  async getCustomerByIdLambda(req: any): Promise<APIGatewayProxyResult> {
    try {
      const { id } = req.pathParameters;
      const customer = await this.customerService.findById(id);

      if (!customer) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Customer not found." }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(customer),
      };
    } catch (error) {
      return this.handleErrorLambda(
        error,
        "An unknown error occurred while retrieving the customer:"
      );
    }
  }

  /**
   * @swagger
   * /customers/{id}:
   *   put:
   *     tags: [Customers]
   *     summary: Update a customer
   *     description: Updates an existing customer in the system.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The ID of the customer to update
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Jane Doe"
   *                 description: "The new name of the customer (min length: 3)"
   *               email:
   *                 type: string
   *                 example: "jane.doe@example.com"
   *                 description: "The new email of the customer, must be unique and valid format"
   *               availableCredit:
   *                 type: number
   *                 example: 1500
   *                 description: "The available credit for the customer (must be a valid number)"
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
   *                 name:
   *                   type: string
   *                 email:
   *                   type: string
   *                 availableCredit:
   *                   type: number
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
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Email is already in use."
   *                 statusCode:
   *                   type: integer
   *                   example: 409
   *       500:
   *         description: An error occurred
   *         content:
   *           application/json:
   *             example:
   *               error: "An error occurred when updating customer: <error message>"
   */
  async updateCustomerLambda(req: any): Promise<APIGatewayProxyResult> {
    try {
      const { id } = req.pathParameters;
      const updatedData = JSON.parse(req.body);

      // Extract the necessary properties from updatedData
      const customerToUpdate = {
        id,
        ...updatedData,
      };

      // Call the update service passing the id and individual properties
      const updatedCustomer = await this.customerService.update(
        customerToUpdate.id,
        customerToUpdate.name,
        customerToUpdate.email,
        customerToUpdate.availableCredit
      );

      return {
        statusCode: 200,
        body: JSON.stringify(updatedCustomer),
      };
    } catch (error) {
      return this.handleErrorLambda(
        error,
        "An error occurred when updating customer:"
      );
    }
  }

  /**
   * @swagger
   * /customers/{id}:
   *   delete:
   *     tags: [Customers]
   *     summary: Delete a customer
   *     description: Deletes an existing customer from the system.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The ID of the customer to delete
   *         schema:
   *           type: string
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
  async deleteCustomerLambda(req: any): Promise<APIGatewayProxyResult> {
    try {
      const { id } = req.pathParameters;
      await this.customerService.delete(id);
      return {
        statusCode: 204, // No Content
        body: "",
      };
    } catch (error) {
      return this.handleErrorLambda(
        error,
        "An error occurred when deleting customer:"
      );
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
   *        500:
   *         description: An unknown error occurred
   *         content:
   *           application/json:
   *             example:
   *               error: "An error occurred when adding credit: <error message>"
   */
  async addCreditLambda(req: any): Promise<APIGatewayProxyResult> {
    try {
      const { id, amount } = JSON.parse(req.body);
      const customer = await this.customerService.addCredit(id, amount);
      return {
        statusCode: 200,
        body: JSON.stringify(customer),
      };
    } catch (error) {
      return this.handleErrorLambda(
        error,
        "An error occurred when adding credit:"
      );
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
  async sortCustomersByCreditLambda(req: any): Promise<APIGatewayProxyResult> {
    const order = req.queryStringParameters?.order || "desc";

    try {
      const sortedCustomers = await this.customerService.sortCustomersByCredit(
        order
      );
      return {
        statusCode: 200,
        body: JSON.stringify(sortedCustomers),
      };
    } catch (error) {
      return this.handleErrorLambda(
        error,
        "An error occurred while sorting customers by credit:"
      );
    }
  }

  /**
   * Handles an error that occurred in a Lambda function by
   * returning an API Gateway Proxy Result that contains the
   * error message and a status code. If the error is a custom
   * error, uses the error code and message from the error.
   * Otherwise, uses a generic 500 status code and a string
   * containing the error message.
   * @param error the error to handle
   * @param errorMessage the error message
   * @returns an API Gateway Proxy Result
   */
  private handleErrorLambda(
    error: any,
    errorMessage: string
  ): APIGatewayProxyResult {
    if (isCustomError(error)) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          error: error.message,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: errorMessage + (error as Error).message,
        }),
      };
    }
  }
}
