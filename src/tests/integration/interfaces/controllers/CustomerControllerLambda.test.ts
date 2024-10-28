import request from "supertest";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CustomerControllerLambda } from "../../../../interfaces/controllers/CustomerControllerLambda";
import { CustomerService } from "../../../../application/CustomerService";
import { InMemoryCustomerRepository } from "../../../../infrastructure/persistence/repositories/InMemoryCustomerRepository";

describe("CustomerControllerLambda", () => {
  let customerController: CustomerControllerLambda;
  let customerService: CustomerService;

  beforeEach(() => {
    const customerRepository = new InMemoryCustomerRepository();
    customerService = new CustomerService(customerRepository);
    customerController = new CustomerControllerLambda(customerService);
  });

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

    await customerController.createCustomerLambda(event); // Crear cliente primero

    const result: APIGatewayProxyResult =
      await customerController.createCustomerLambda(event);

    expect(result.statusCode).toBe(409);
    const response = JSON.parse(result.body);
    expect(response.error).toBe("Email is already in use.");
  });

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
        id: "9999", // ID que no existe
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

  it("should return 400 when adding negative credit", async () => {
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
  // TODO TEST EmptyNameException.ts InvalidSortOrderException.ts NameTooShortException.ts
});
