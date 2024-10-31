import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import express, { Request, Response, NextFunction } from "express";
import { CustomerService } from "../application/CustomerService";
import { MongoDBCustomerRepository } from "./persistence/repositories/MongoDBCustomerRepository";
import { CustomerControllerLambda } from "../interfaces/controllers/CustomerControllerLambda";
import awsServerlessExpress from "aws-serverless-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Swagger Configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Motorbike Shop API",
      version: "1.0.0",
      description: "API for managing customers of an online motorbike shop",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/interfaces/controllers/*.ts"],
};
const specs = swaggerJsdoc(options);

// Repository and customer service
const customerRepository = new MongoDBCustomerRepository(
  process.env.MONGODB_URI!,
  process.env.DB_NAME!,
  process.env.COLLECTION_NAME!
);
const customerService = new CustomerService(customerRepository);
const customerControllerLambda = new CustomerControllerLambda(customerService);

// Define your Lambda functions

/**
 * Handles the creation of a new customer.
 *
 * This function processes an API Gateway event to create a new customer using
 * the provided customer details in the request body. It delegates the creation
 * process to the `createCustomerLambda` method of `CustomerControllerLambda`.
 *
 * @param {APIGatewayEvent} event - The event object from API Gateway containing
 * the request details.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the
 * response object with the status and body of the created customer.
 */
export const create = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return await customerControllerLambda.createCustomerLambda(event);
};

/**
 * Handles the retrieval of all customers.
 *
 * This function processes an API Gateway event to list all customers
 * in the system. It delegates the listing process to the `listCustomersLambda`
 * method of `CustomerControllerLambda`.
 *
 * @param {APIGatewayEvent} event - The event object from API Gateway containing
 * the request details.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the
 * response object with the status and body containing the list of customers.
 */
export const list = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return await customerControllerLambda.listCustomersLambda(event);
};

/**
 * Handles the retrieval of a customer by ID.
 *
 * This function processes an API Gateway event to retrieve a specific customer
 * based on the provided customer ID in the request path. It delegates the
 * retrieval process to the `getCustomerByIdLambda` method of `CustomerControllerLambda`.
 *
 * @param {APIGatewayEvent} event - The event object from API Gateway containing
 * the request details.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the
 * response object with the status and body containing the requested customer.
 */
export const getCustomer = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return await customerControllerLambda.getCustomerByIdLambda(event);
};

/**
 * Handles the update of an existing customer.
 *
 * This function processes an API Gateway event to update an existing
 * customer using the provided customer details in the request body. It
 * delegates the update process to the `updateCustomerLambda` method of
 * `CustomerControllerLambda`.
 *
 * @param {APIGatewayEvent} event - The event object from API Gateway
 * containing the request details.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the
 * response object with the status and body of the updated customer.
 */
export const update = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return await customerControllerLambda.updateCustomerLambda(event);
};

/**
 * Handles the deletion of an existing customer.
 *
 * This function processes an API Gateway event to delete an existing
 * customer from the system. It delegates the deletion process to the
 * `deleteCustomerLambda` method of `CustomerControllerLambda`.
 *
 * @param {APIGatewayEvent} event - The event object from API Gateway
 * containing the request details.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the
 * response object with the status and body containing the deleted customer.
 */
export const deleteCustomer = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return await customerControllerLambda.deleteCustomerLambda(event);
};

/**
 * Handles adding credit to a customer's account.
 *
 * This function processes an API Gateway event to add a specified amount
 * of credit to a customer's account. It delegates the credit addition
 * process to the `addCreditLambda` method of `CustomerControllerLambda`.
 *
 * @param {APIGatewayEvent} event - The event object from API Gateway
 * containing the request details, including customer ID and credit amount.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the
 * response object with the status and body indicating the outcome of the
 * credit addition.
 */
export const addCredit = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return await customerControllerLambda.addCreditLambda(event);
};

/**
 * Handles sorting customers by available credit.
 *
 * This function processes an API Gateway event to retrieve a list of customers
 * sorted by their available credit. It delegates the sorting process to the
 * `sortCustomersByCreditLambda` method of `CustomerControllerLambda`.
 *
 * @param {APIGatewayEvent} event - The event object from API Gateway
 * containing the request details, including the order of sorting.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the
 * response object with the status and body containing the sorted list of
 * customers.
 */
export const sortCustomersByCredit = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return await customerControllerLambda.sortCustomersByCreditLambda(event);
};

/**
 * Returns the API documentation as a JSON object.
 *
 * This function processes an API Gateway event to return the API documentation
 * as a JSON object. The documentation is generated by swagger-jsdoc based on
 * the OpenAPI specification defined in the `options` object.
 *
 * @param {APIGatewayEvent} event - The event object from API Gateway
 * containing the request details.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the
 * response object with the status and body containing the API documentation.
 */
export const apiDocs = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(specs),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

// Error handling
/* istanbul ignore next */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.format({
    'application/json': () => next(),
    'default': () => next(),  // Continúa al siguiente middleware
  });
  console.error(err.stack);
  const errorMessage = "Something broke!";
  res.setHeader('Content-Type', 'application/json');
  res.status(500).json({
    error: errorMessage + ' ' + (err as Error).message,
  });
});

// Exporting the Lambda Handler
const server = awsServerlessExpress.createServer(app);

/**
 * AWS Lambda handler function for processing API Gateway events.
 *
 * This function acts as an entry point for AWS Lambda execution, using the
 * aws-serverless-express library to proxy requests to the Express application.
 *
 * @param {object} event - The event object representing the request from API Gateway.
 * @param {object} context - The context object providing information about the invocation, function, and execution environment.
 */
export const handler = (event: any, context: any) =>
  awsServerlessExpress.proxy(server, event, context);
