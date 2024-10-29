import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CustomerControllerLambda } from "../../../../interfaces/controllers/CustomerControllerLambda";
import { CustomerService } from "../../../../application/CustomerService";
import { InMemoryCustomerRepository } from "../../../../infrastructure/persistence/repositories/InMemoryCustomerRepository";
import { Customer } from "../../../../domain/Customer";

describe("CustomerControllerLambda", () => {
  let customerController: CustomerControllerLambda;
  let customerService: CustomerService;

  beforeEach(() => {
    const customerRepository = new InMemoryCustomerRepository();
    customerService = new CustomerService(customerRepository);
    customerController = new CustomerControllerLambda(customerService);
  });

  describe("CustomerController - Create Customer Lambda", () => {
    it("should create a new customer", async () => {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.createCustomerLambda(event);

      expect(result.statusCode).toBe(201);
      const customer = JSON.parse(result.body);
      expect(customer).toHaveProperty("id");
      expect(customer.name).toBe("John Doe");
      expect(customer.email).toBe("john.doe@example.com");
      expect(customer.availableCredit).toBe(1000);
    });

    it("should return 400 if email format is invalid when creating a customer", async () => {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "invalid-email",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.createCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Invalid email format.");
    });

    it("should return 400 if email input type is invalid when creating a customer", async () => {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: 1000,
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.createCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "Invalid type for property email: expected string, but received number."
      );
    });

    it("should return 409 if email is already in use when creating a customer", async () => {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      await customerController.createCustomerLambda(event);

      const result: APIGatewayProxyResult =
        await customerController.createCustomerLambda(event);

      expect(result.statusCode).toBe(409);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Email is already in use.");
    });

    it("should return 400 if name is invalid type when creating a customer", async () => {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: 1,
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.createCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "Invalid type for property name: expected string, but received number."
      );
    });

    it("should return 400 if name is empty when creating a customer", async () => {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.createCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Name cannot be empty.");
    });

    it("should return 400 if name is to short when creating a customer", async () => {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "Jo",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.createCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Name must be at least 3 characters long.");
    });

    it("should return 400 if availableCredit is invalid type when creating a customer", async () => {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: "invalid-available-credit",
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.createCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "Invalid type for property amount: expected number, but received string."
      );
    });

    it("should return a 500 error when an unexpected error occurs", async () => {
      jest
        .spyOn(customerService, "create")
        .mockRejectedValue(new Error("Unexpected error"));

      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.createCustomerLambda(event);

      expect(result.statusCode).toBe(500);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "An unknown error occurred when creating customer: Unexpected error"
      );

      // Restore the `create` method to its original behavior after testing
      jest.restoreAllMocks();
    });
  });

  describe("CustomerController - List Customers Lambda", () => {
    it("should list all customers", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {},
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.listCustomersLambda(event);

      expect(result.statusCode).toBe(200);
      const customers = JSON.parse(result.body);
      expect(Array.isArray(customers)).toBe(true);
    });

    it("should return a 500 error when an unexpected error occurs", async () => {
      jest
        .spyOn(customerService, "list")
        .mockRejectedValue(new Error("Unexpected error"));

      const event: APIGatewayProxyEvent = {
        pathParameters: {},
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.listCustomersLambda(event);

      expect(result.statusCode).toBe(500);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "An unknown error occurred when retrieving customers: Unexpected error"
      );

      // Restore the `list` method to its original behavior after testing
      jest.restoreAllMocks();
    });
  });

  describe("CustomerController - Get Customer Lambda", () => {
    it("should retrieve a customer by ID", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: customerCreate.id,
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.getCustomerByIdLambda(event);

      expect(result.statusCode).toBe(200);
      const customer = JSON.parse(result.body);
      expect(customer).toHaveProperty("id", customerCreate.id);
    });

    it("should return 404 when customer not found", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: "12345678a",
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.getCustomerByIdLambda(event);

      expect(result.statusCode).toBe(404);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Customer not found.");
    });

    it("should return 400 when customer id is not valid", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: "invalid-id",
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.getCustomerByIdLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "Invalid type for property id: expected string containing exactly 9 alphanumeric characters, but received string."
      );
    });

    it("should return a 500 error when an unexpected error occurs", async () => {
      jest
        .spyOn(customerService, "findById")
        .mockRejectedValue(new Error("Unexpected error"));

      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: customerCreate.id,
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.getCustomerByIdLambda(event);

      expect(result.statusCode).toBe(500);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "An unknown error occurred while retrieving the customer: Unexpected error"
      );

      // Restore the `findById` method to its original behavior after testing
      jest.restoreAllMocks();
    });

    it("should return a 404 error when a customer is not found", async () => {
      // Mock `findById` to return a `Promise` that resolves to `undefined`
      jest.spyOn(customerService, "findById").mockResolvedValue(undefined);

      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: customerCreate.id,
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.getCustomerByIdLambda(event);

      expect(result.statusCode).toBe(404);
      const response = JSON.parse(result.body);
      expect(response.message).toBe("Customer not found.");

      // Restore the original behavior of `findById` after the test
      jest.restoreAllMocks();
    });
  });

  describe("CustomerController - Update Customer Lambda", () => {
    it("should update an existing customer", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: customerCreate.id,
        },
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane.doe@example.com",
          availableCredit: 1500,
        }),
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.updateCustomerLambda(event);

      expect(result.statusCode).toBe(200);
      const updatedCustomer = JSON.parse(result.body);
      expect(updatedCustomer.name).toBe("Jane Doe");
    });

    it("should return 404 when updating a non-existing customer", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: "12345678a",
        },
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane.doe@example.com",
          availableCredit: 1500,
        }),
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.updateCustomerLambda(event);

      expect(result.statusCode).toBe(404);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Customer not found.");
    });

    it("should return 404 when updating a customer with invalid id", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: "invalid-id",
        },
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane.doe@example.com",
          availableCredit: 1500,
        }),
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.updateCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "Invalid type for property id: expected string containing exactly 9 alphanumeric characters, but received string."
      );
    });

    it("should return 400 when updating with no valid credit", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const invalidAmount = "1500";
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: customerCreate.id,
        },
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane.doe@example.com",
          availableCredit: invalidAmount,
        }),
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.updateCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        `Invalid type for property amount: expected number, but received string.`
      );
    });

    it("should return 400 if name is not a string", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "existingemail@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);
      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        pathParameters: { id: customerCreate.id },
        body: JSON.stringify({
          name: 123,
          email: "validemail@example.com",
          availableCredit: 500,
        }),
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.updateCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "Invalid type for property name: expected string, but received number."
      );
    });

    it("should return 400 if name is empty", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "existingemail@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);
      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);
      const event: APIGatewayProxyEvent = {
        pathParameters: { id: customerCreate.id },
        body: JSON.stringify({
          name: "",
          email: "validemail@example.com",
          availableCredit: 500,
        }),
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.updateCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Name cannot be empty.");
    });

    it("should return 400 if name is shorter than 3 characters", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "existingemail@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);
      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);
      const event: APIGatewayProxyEvent = {
        pathParameters: { id: customerCreate.id },
        body: JSON.stringify({
          name: "Jo",
          email: "validemail@example.com",
          availableCredit: 500,
        }),
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.updateCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Name must be at least 3 characters long.");
    });

    it("should return 400 if email is not in a valid format", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "existingemail@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);
      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);
      const event: APIGatewayProxyEvent = {
        pathParameters: { id: customerCreate.id },
        body: JSON.stringify({
          name: "John Doe",
          email: "invalidemail",
          availableCredit: 500,
        }),
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.updateCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Invalid email format.");
    });

    it("should return 409 if email is already in use", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "customer1@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);
      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const eventCreate2: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe 2",
          email: "existingemail@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate2: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate2);
      expect(resultCreate2.statusCode).toBe(201);
      const customerCreate2 = JSON.parse(resultCreate2.body);

      const event: APIGatewayProxyEvent = {
        pathParameters: { id: customerCreate.id },
        body: JSON.stringify({
          name: "John Doe",
          email: "existingemail@example.com",
          availableCredit: 1000,
        }),
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.updateCustomerLambda(event);

      expect(result.statusCode).toBe(409);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Email is already in use.");
    });

    it("should return a 500 error when an unexpected error occurs", async () => {
      jest
        .spyOn(customerService, "update")
        .mockRejectedValue(new Error("Unexpected error"));

      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: customerCreate.id,
        },
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane.doe@example.com",
          availableCredit: 1500,
        }),
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.updateCustomerLambda(event);

      expect(result.statusCode).toBe(500);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "An unknown error occurred when updating customer: Unexpected error"
      );

      // Restore the `update` method to its original behavior after testing
      jest.restoreAllMocks();
    });
  });

  describe("CustomerController - Delete Customer Lambda", () => {
    it("should delete a customer", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: customerCreate.id,
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.deleteCustomerLambda(event);

      expect(result.statusCode).toBe(204);
    });

    it("should return 400 if id is not a string", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: 123,
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.deleteCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "Invalid type for property id: expected string, but received number."
      );
    });

    it("should return 400 if id is invalid", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: "invalid-id",
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.deleteCustomerLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "Invalid type for property id: expected string containing exactly 9 alphanumeric characters, but received string."
      );
    });

    it("should return 404 when deleting a non-existing customer", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: "12345678a",
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.deleteCustomerLambda(event);

      expect(result.statusCode).toBe(404);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Customer not found.");
    });

    it("should return a 500 error when an unexpected error occurs", async () => {
      jest
        .spyOn(customerService, "delete")
        .mockRejectedValue(new Error("Unexpected error"));

      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: customerCreate.id,
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.deleteCustomerLambda(event);

      expect(result.statusCode).toBe(500);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "An unknown error occurred when deleting customer: Unexpected error"
      );

      // Restore the `delete` method to its original behavior after testing
      jest.restoreAllMocks();
    });
  });

  describe("CustomerController - Add credit Lambda", () => {
    it("should add credit to a customer", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          id: customerCreate.id,
          amount: 100,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.addCreditLambda(event);

      expect(result.statusCode).toBe(200);
      const customer = JSON.parse(result.body);
      expect(customer.availableCredit).toBeGreaterThan(1000);
    });

    it("should return 404 when adding credit to a non-existing customer", async () => {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          id: "12345678a",
          amount: 100,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.addCreditLambda(event);

      expect(result.statusCode).toBe(404);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Customer not found.");
    });

    it("should return 404 when adding credit to a customer with invalid id", async () => {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          id: "invalid-id",
          amount: 100,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.addCreditLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "Invalid type for property id: expected string containing exactly 9 alphanumeric characters, but received string."
      );
    });

    it("should return 452 when adding negative credit", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          id: customerCreate.id,
          amount: -50,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.addCreditLambda(event);

      expect(result.statusCode).toBe(452);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Credit amount cannot be negative.");
    });

    it("should return 400 when adding invalid credit", async () => {
      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const invalidAmount = "invalid-amount";
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          id: customerCreate.id,
          amount: invalidAmount,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.addCreditLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        `Invalid type for property amount: expected number, but received string.`
      );
    });

    it("should return a 500 error when an unexpected error occurs", async () => {
      jest
        .spyOn(customerService, "addCredit")
        .mockRejectedValue(new Error("Unexpected error"));

      const eventCreate: APIGatewayProxyEvent = {
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          availableCredit: 1000,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const resultCreate: APIGatewayProxyResult =
        await customerController.createCustomerLambda(eventCreate);

      expect(resultCreate.statusCode).toBe(201);
      const customerCreate = JSON.parse(resultCreate.body);

      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          id: customerCreate.id,
          amount: 100,
        }),
        pathParameters: {},
        queryStringParameters: {},
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.addCreditLambda(event);

      expect(result.statusCode).toBe(500);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "An unknown error occurred when adding credit: Unexpected error"
      );

      // Restore the `addCredit` method to its original behavior after testing
      jest.restoreAllMocks();
    });
  });

  describe("CustomerControllerLambda - sortCustomersByCreditLambda", () => {
    const sortedCustomersMock = [
      new Customer("1", "Customer One", "one@example.com", 300),
      new Customer("2", "Customer Two", "two@example.com", 200),
      new Customer("3", "Customer Three", "three@example.com", 100),
    ];

    beforeEach(() => {
      jest
        .spyOn(customerService, "sortCustomersByCredit")
        .mockResolvedValue(sortedCustomersMock);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return 200 and a sorted list of customers when order is 'asc'", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {},
        queryStringParameters: { order: "asc" },
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.sortCustomersByCreditLambda(event);

      expect(result.statusCode).toBe(200);
      const response = JSON.parse(result.body);
      expect(response).toEqual(sortedCustomersMock);
      expect(customerService.sortCustomersByCredit).toHaveBeenCalledWith("asc");
    });

    it("should return 200 and a sorted list of customers with default order 'desc' when no order is provided", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {},
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.sortCustomersByCreditLambda(event);

      expect(result.statusCode).toBe(200);
      const response = JSON.parse(result.body);
      expect(response).toEqual(sortedCustomersMock);
      expect(customerService.sortCustomersByCredit).toHaveBeenCalledWith(
        "desc"
      );
    });

    it("should return 200 and a sorted list of customers when order is 'desc'", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {},
        queryStringParameters: { order: "desc" },
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.sortCustomersByCreditLambda(event);

      expect(result.statusCode).toBe(200);
      const response = JSON.parse(result.body);
      expect(response).toEqual(sortedCustomersMock);
      expect(customerService.sortCustomersByCredit).toHaveBeenCalledWith(
        "desc"
      );
    });

    it("should return 409 if order is invalid in should list all customers", async () => {
        jest.restoreAllMocks();
      
        const event: APIGatewayProxyEvent = {
          pathParameters: {},
          queryStringParameters: { order: "invalid-order" },
          body: null,
        } as any;
      
        const result: APIGatewayProxyResult = await customerController.sortCustomersByCreditLambda(event);
      
        expect(result.statusCode).toBe(400);
        const response = JSON.parse(result.body);
        expect(response.error).toBe("Invalid sort order. Use 'asc' or 'desc'.");
      });      

    it("should return a 500 error when an unexpected error occurs", async () => {
      jest
        .spyOn(customerService, "sortCustomersByCredit")
        .mockRejectedValue(new Error("Unexpected error"));

      const event: APIGatewayProxyEvent = {
        pathParameters: {},
        queryStringParameters: {
          order: "asc",
        },
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.sortCustomersByCreditLambda(event);

      expect(result.statusCode).toBe(500);
      const response = JSON.parse(result.body);
      expect(response.error).toBe(
        "An unknown error occurred while sorting customers by credit: Unexpected error"
      );

      // Restore the `create` method to its original behavior after testing
      jest.restoreAllMocks();
    });
  });
});
