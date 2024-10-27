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
});
