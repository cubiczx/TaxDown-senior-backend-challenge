import request from "supertest";
import { app } from "../../../../infrastructure/Server";
import { InMemoryCustomerRepository } from "../../../../infrastructure/persistence/repositories/InMemoryCustomerRepository";
import { Customer } from "../../../../domain/Customer";

describe("CustomerController Integration Tests", () => {
  let customerRepository: InMemoryCustomerRepository;

  beforeAll(async () => {
    customerRepository = app.locals.customerRepository; // Real repository from the context of the app
  });

  beforeEach(async () => {
    await customerRepository.clear(); // Clean repository before each test
  });

  describe("POST /customers", () => {
    it("should create a new customer", async () => {
      const newCustomer = {
        name: "John Doe",
        email: "john.doe@example.com",
        availableCredit: 500,
      };
      const response = await request(app).post("/customers").send(newCustomer);
      expect(response.status).toBe(201);
    });

    it("should return 409 if email is already in use", async () => {
      const customer = {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        availableCredit: 300,
      };
      await request(app).post("/customers").send(customer);
      const response = await request(app).post("/customers").send(customer);
      expect(response.status).toBe(409);
    });

    it("should return 400 if email is invalid", async () => {
      const invalidCustomer = {
        name: "Invalid Email",
        email: "invalid-email",
        availableCredit: 200,
      };
      const response = await request(app)
        .post("/customers")
        .send(invalidCustomer);
      expect(response.status).toBe(400);
    });

    it("should return 400 if name is empty", async () => {
      const invalidCustomer = {
        name: "",
        email: "empty.name@example.com",
        availableCredit: 300,
      };
      const response = await request(app)
        .post("/customers")
        .send(invalidCustomer);
      expect(response.status).toBe(400);
    });

    it("should return 400 if name is too short", async () => {
      const invalidCustomer = {
        name: "Jo",
        email: "short.name@example.com",
        availableCredit: 300,
      };
      const response = await request(app)
        .post("/customers")
        .send(invalidCustomer);
      expect(response.status).toBe(400);
    });

    it("should return 400 if name is not a string", async () => {
      const invalidCustomer = {
        name: 12345,
        email: "non.string@example.com",
        availableCredit: 300,
      };
      const response = await request(app)
        .post("/customers")
        .send(invalidCustomer);
      expect(response.status).toBe(400);
    });

    it("should return 400 if email is not a string", async () => {
      const invalidCustomer = {
        name: "Valid Name",
        email: 12345,
        availableCredit: 300,
      };
      const response = await request(app)
        .post("/customers")
        .send(invalidCustomer);
      expect(response.status).toBe(400);
    });

    it("should return 400 if availableCredit is not a number", async () => {
      const invalidCustomer = {
        name: "Valid Name",
        email: "valid@example.com",
        availableCredit: "not-a-number",
      };
      const response = await request(app)
        .post("/customers")
        .send(invalidCustomer);
      expect(response.status).toBe(400);
    });

    it("should return 452 if availableCredit is negative", async () => {
      const invalidCustomer = {
        name: "Valid Name",
        email: "valid@example.com",
        availableCredit: -100,
      };
      const response = await request(app)
        .post("/customers")
        .send(invalidCustomer);
      expect(response.status).toBe(452);
    });
  });

  describe("GET /customers", () => {
    it("should retrieve a list of customers", async () => {
      const response = await request(app).get("/customers");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return an empty array if no customers exist", async () => {
      await customerRepository.clear();
      const response = await request(app).get("/customers");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /customers/:id', () => {
    it('should return a customer if found', async () => {
      const newCustomer = await request(app).post("/customers").send({
        name: "Customer To get",
        email: "get.me@example.com",
        availableCredit: 200,
      });

      const response = await request(app).get(`/customers/${newCustomer.body.id}`);

      expect(response.status).toBe(200);
    });

    it('should return 404 if customer not found', async () => {
      const response = await request(app).get('/customers/2');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Customer not found');
    });
  });

  describe("PUT /customers/:id", () => {
    it("should update an existing customer", async () => {
      const newCustomer = await request(app).post("/customers").send({
        name: "John Smith",
        email: "john.smith@example.com",
        availableCredit: 1000,
      });

      const updateData = { name: "John Smith Updated", availableCredit: 1500 };
      const response = await request(app)
        .put(`/customers/${newCustomer.body.id}`)
        .send(updateData);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("John Smith Updated");
    });

    it("should update one field of an existing customer", async () => {
      // 1. Create a test client
      const customerData = {
        name: "Original Name",
        email: "original@example.com",
        availableCredit: 100,
      };

      const createdCustomer = await request(app)
        .post("/customers")
        .send(customerData)
        .expect(201);

      // 2. Update only the customer name
      const updatedCustomerData = {
        name: "Updated Name",
      };

      const response = await request(app)
        .put(`/customers/${createdCustomer.body.id}`)
        .send(updatedCustomerData)
        .expect(200);

      // 3. Verify that the response contains the updated client
      expect(response.body).toMatchObject({
        id: createdCustomer.body.id,
        name: "Updated Name",
        email: "original@example.com",
        availableCredit: 100,
      });

      // 4. Check the database (optional, if you have access to the DB)
      const updatedCustomerInDb = await customerRepository.findById(
        createdCustomer.body.id
      );
      expect(updatedCustomerInDb).toMatchObject({
        name: "Updated Name",
        email: "original@example.com",
        availableCredit: 100,
      });
    });

    it("should return 404 if customer does not exist", async () => {
      const response = await request(app)
        .put(`/customers/invalid-id`)
        .send({ name: "Non-existent Customer" });
      expect(response.status).toBe(404);
    });

    it("should throw InvalidTypeException for email", async () => {
      const customer = await request(app).post("/customers").send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        availableCredit: 300,
      });

      const response = await request(app)
        .put(`/customers/${customer.body.id}`)
        .send({ email: 123 });
      expect(response.status).toBe(400);
    });

    it("should throw InvalidEmailFormatException for invalid email format", async () => {
      const customer = await request(app).post("/customers").send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        availableCredit: 300,
      });

      const response = await request(app)
        .put(`/customers/${customer.body.id}`)
        .send({ email: "invalid-email" });
      expect(response.status).toBe(400);
    });

    it("should throw EmailAlreadyInUseException if email is already used", async () => {
      await request(app).post("/customers").send({
        name: "John Doe",
        email: "john.doe@example.com",
        availableCredit: 500,
      });
      const customer = await request(app).post("/customers").send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        availableCredit: 300,
      });

      const response = await request(app)
        .put(`/customers/${customer.body.id}`)
        .send({ email: "john.doe@example.com" });
      expect(response.status).toBe(409);
    });

    it("should throw InvalidTypeException for name", async () => {
      const customer = await request(app).post("/customers").send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        availableCredit: 300,
      });

      const response = await request(app)
        .put(`/customers/${customer.body.id}`)
        .send({ name: 123 });
      expect(response.status).toBe(400);
    });

    it("should throw EmptyNameException if name is empty", async () => {
      const customer = await request(app).post("/customers").send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        availableCredit: 300,
      });

      const response = await request(app)
        .put(`/customers/${customer.body.id}`)
        .send({ name: "" });
      expect(response.status).toBe(400);
    });

    it("should throw NameTooShortException if name is too short", async () => {
      const customer = await request(app).post("/customers").send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        availableCredit: 300,
      });

      const response = await request(app)
        .put(`/customers/${customer.body.id}`)
        .send({ name: "Jo" });
      expect(response.status).toBe(400);
    });

    it("should throw InvalidTypeException for availableCredit", async () => {
      const customer = await request(app).post("/customers").send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        availableCredit: 300,
      });

      const response = await request(app)
        .put(`/customers/${customer.body.id}`)
        .send({ availableCredit: "not-a-number" });
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /customers/:id", () => {
    it("should delete a customer by id", async () => {
      const newCustomer = await request(app).post("/customers").send({
        name: "Customer To Delete",
        email: "delete.me@example.com",
        availableCredit: 200,
      });

      const response = await request(app).delete(
        `/customers/${newCustomer.body.id}`
      );
      expect(response.status).toBe(204);
    });

    it("should return 404 if customer does not exist", async () => {
      const response = await request(app).delete(`/customers/invalid-id`);
      expect(response.status).toBe(404);
    });

    it("should return 404 if trying to delete a non-existent customer", async () => {
      const response = await request(app).delete('/customers/invalid-id');
      expect(response.status).toBe(404);
    });
  });

  describe("POST /customers/credit", () => {
    it("should throw InvalidTypeException for id", async () => {
      const response = await request(app)
        .post("/customers/credit")
        .send({ id: 123, amount: 100 });
      expect(response.status).toBe(400);
    });

    it("should throw CustomerNotFoundException if customer does not exist", async () => {
      const response = await request(app)
        .post("/customers/credit")
        .send({ id: "non-existent-id", amount: 100 });
      expect(response.status).toBe(404);
    });

    it("should throw InvalidTypeException for amount", async () => {
      const newCustomer = await request(app).post("/customers").send({
        name: "Credit Test",
        email: "credit.test@example.com",
        availableCredit: 200,
      });

      const response = await request(app)
        .post("/customers/credit")
        .send({ id: newCustomer.body.id, amount: "not-a-number" });
      expect(response.status).toBe(400);
    });

    it("should throw NegativeCreditAmountException if amount is negative", async () => {
      const newCustomer = await request(app).post("/customers").send({
        name: "Credit Test",
        email: "credit.test@example.com",
        availableCredit: 200,
      });

      const response = await request(app)
        .post("/customers/credit")
        .send({ id: newCustomer.body.id, amount: -50 });
      expect(response.status).toBe(452);
    });

    it("should add credit to an existing customer", async () => {
      // Arrange
      const newCustomer = await request(app).post("/customers").send({
        name: "Credit Test",
        email: "credit.test@example.com",
        availableCredit: 200,
      });

      const creditAmount = 150;

      // Act
      const response = await request(app)
        .post("/customers/credit")
        .send({ id: newCustomer.body.id, amount: creditAmount });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: newCustomer.body.id,
        name: "Credit Test",
        email: "credit.test@example.com",
        availableCredit: 350,
      });
    });
  });

  describe("GET /customers/sortByCredit", () => {
    it("should return customers sorted by available credit", async () => {
      const customers = [
        new Customer("1", "Alice", "alice@example.com", 100),
        new Customer("2", "Bob", "bob@example.com", 200),
        new Customer("3", "Charlie", "charlie@example.com", 50),
      ];

      // Add clients to the repository
      for (const customer of customers) {
        await customerRepository.create(customer);
      }

      // Make the GET request with the default order (descending)
      const responseDesc = await request(app).get("/customers/sortByCredit");

      expect(responseDesc.status).toBe(200);
      // Verify that customers are sorted correctly by available credit (descending)
      expect(responseDesc.body).toEqual([
        {
          id: "2",
          name: "Bob",
          email: "bob@example.com",
          availableCredit: 200,
        },
        {
          id: "1",
          name: "Alice",
          email: "alice@example.com",
          availableCredit: 100,
        },
        {
          id: "3",
          name: "Charlie",
          email: "charlie@example.com",
          availableCredit: 50,
        },
      ]);

      // Make the GET request with the ascending order parameter
      const responseAsc = await request(app).get(
        "/customers/sortByCredit?order=asc"
      );

      expect(responseAsc.status).toBe(200);
      // Check that customers are sorted correctly by available credit (ascending)
      expect(responseAsc.body).toEqual([
        {
          id: "3",
          name: "Charlie",
          email: "charlie@example.com",
          availableCredit: 50,
        },
        {
          id: "1",
          name: "Alice",
          email: "alice@example.com",
          availableCredit: 100,
        },
        {
          id: "2",
          name: "Bob",
          email: "bob@example.com",
          availableCredit: 200,
        },
      ]);
    });

    it("should return 400 for invalid sort order", async () => {
      const response = await request(app).get(
        "/customers/sortByCredit?order=invalid"
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Invalid sort order. Use 'asc' or 'desc'.",
      });
    });

    it("should return customers sorted by available credit in ascending order when specified", async () => {
      const customer1 = new Customer("1", "Alice", "alice@example.com", 150);
      const customer2 = new Customer("2", "Bob", "bob@example.com", 100);
      await customerRepository.create(customer1);
      await customerRepository.create(customer2);

      const response = await request(app).get(
        "/customers/sortByCredit?order=asc"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: "2",
          name: "Bob",
          email: "bob@example.com",
          availableCredit: 100,
        },
        {
          id: "1",
          name: "Alice",
          email: "alice@example.com",
          availableCredit: 150,
        },
      ]);
    });

    it("should return an empty list when no customers exist", async () => {
      await customerRepository.clear();

      const response = await request(app).get("/customers/sortByCredit");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
