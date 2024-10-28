import request from "supertest";
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
        await customerController.getCustomerLambda(event);

      expect(result.statusCode).toBe(200);
      const customer = JSON.parse(result.body);
      expect(customer).toHaveProperty("id", customerCreate.id);
    });

    it("should return 404 when customer not found", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: "9999",
        },
        queryStringParameters: {},
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.getCustomerLambda(event);

      expect(result.statusCode).toBe(404);
      const response = JSON.parse(result.body);
      expect(response.message).toBe("Customer not found.");
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
          id: "9999", // ID que no existe
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

    it("should return 404 when deleting a non-existing customer", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          id: "9999",
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
          id: "9999",
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
  });

  describe("CustomerController - Sort customer by credit Lambda", () => {
    it("should return 200 and a sorted list of customers when order is valid", async () => {
      const sortedCustomersMock = [
        new Customer("1", "Customer One", "one@example.com", 300),
        new Customer("2", "Customer Two", "two@example.com", 200),
        new Customer("3", "Customer Three", "three@example.com", 100),
      ];

      // Mockear el método de servicio para devolver la lista de clientes simulada
      jest
        .spyOn(customerService, "sortCustomersByCredit")
        .mockResolvedValue(sortedCustomersMock);

      const event: APIGatewayProxyEvent = {
        pathParameters: {},
        queryStringParameters: {
          order: "asc",
        },
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.sortCustomersByCreditLambda(event);

      expect(result.statusCode).toBe(200);
      const response = JSON.parse(result.body);
      expect(response).toEqual(sortedCustomersMock);
      expect(customerService.sortCustomersByCredit).toHaveBeenCalledWith("asc");
    });

    it("should return 409 if order is invalid in should list all customers", async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {},
        queryStringParameters: {
          order: "invalid-order",
        },
        body: null,
      } as any;

      const result: APIGatewayProxyResult =
        await customerController.sortCustomersByCreditLambda(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe("Invalid sort order. Use 'asc' or 'desc'.");
    });
  });
});
