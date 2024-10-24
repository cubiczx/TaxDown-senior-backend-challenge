import request from "supertest";
import { app } from "../../infrastructure/Server";
import { CustomerRepositoryInterface } from "../../domain/repositories/CustomerRepositoryInterface";
import { Customer } from "../../domain/Customer";

describe("CustomerController Integration Tests", () => {
  let customerRepository: CustomerRepositoryInterface;

  beforeEach(() => {
    jest.clearAllMocks(); // clears call state and return values.
    jest.restoreAllMocks(); // resets mocks to their original behavior.
    jest.resetAllMocks(); // resets the state of all mocks, removing any special configuration you've made.
    customerRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      findByAvailableCredit: jest.fn(),
    };

    // Reemplaza el repositorio en el contexto de tu aplicación
    app.locals.customerRepository = customerRepository;
  });

  describe("POST /customers", () => {
    it("should create a new customer", async () => {
      const newCustomer = {
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      const createdCustomer = new Customer(
        "123",
        newCustomer.name,
        newCustomer.email,
        newCustomer.availableCredit
      );

      (customerRepository.create as jest.Mock).mockResolvedValue(
        createdCustomer
      );

      const response = await request(app)
        .post("/customers")
        .send(newCustomer)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(String),
        name: newCustomer.name,
        email: newCustomer.email,
        availableCredit: newCustomer.availableCredit,
      });
    });

    it("should return 409 if email is already in use", async () => {
      const existingCustomer = {
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: 1500,
      };

      // Create the client previously
      await request(app).post("/customers").send(existingCustomer);

      // Try to create another client with the same email
      const response = await request(app)
        .post("/customers")
        .send(existingCustomer)
        .expect(409);

      expect(response.body.error).toBe("Email is already in use.");
    });

    it("should return 400 if email is invalid", async () => {
      const newCustomer = {
        name: "Xavier Palacín Ayuso",
        email: "invalid-email",
        availableCredit: 1000,
      };

      const response = await request(app)
        .post("/customers")
        .send(newCustomer)
        .expect(400);

      expect(response.body.error).toBe("Invalid email format.");
    });

    it("should return 400 if name is empty", async () => {
      const newCustomer = {
        name: "",
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      const response = await request(app)
        .post("/customers")
        .send(newCustomer)
        .expect(400);

      expect(response.body.error).toBe("Name cannot be empty.");
    });

    it("should return 400 if name is too short", async () => {
      const newCustomer = {
        name: "Ab",
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      const response = await request(app)
        .post("/customers")
        .send(newCustomer)
        .expect(400);

      expect(response.body.error).toBe(
        "Name must be at least 3 characters long."
      );
    });

    it("should return 400 if name is not a string", async () => {
      const newCustomer = {
        name: 123, // Invalid property
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      const response = await request(app)
        .post("/customers")
        .send(newCustomer)
        .expect(400);

      expect(response.body.error).toBe(
        "Invalid type for property name: expected string, but received number."
      );
    });

    it("should return 400 if email is not a string", async () => {
      const newCustomer = {
        name: "Xavier Palacín Ayuso",
        email: 123, // Invalid type
        availableCredit: 1000,
      };

      const response = await request(app)
        .post("/customers")
        .send(newCustomer)
        .expect(400);

      expect(response.body.error).toBe(
        "Invalid type for property email: expected string, but received number."
      );
    });

    it("should return 400 if availableCredit is not a number", async () => {
      const newCustomer = {
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: "1000", // Invalid type
      };

      const response = await request(app)
        .post("/customers")
        .send(newCustomer)
        .expect(400);

      expect(response.body.error).toBe(
        "Invalid type for property amount: expected number, but received string."
      );
    });

    it("should return 452 if availableCredit is negative", async () => {
      const newCustomer = {
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: -1000, // Negative value
      };

      const response = await request(app)
        .post("/customers")
        .send(newCustomer)
        .expect(452);

      expect(response.body.error).toBe("Credit amount cannot be negative.");
    });
  });

  describe("GET /customers", () => {
    it("should retrieve a list of customers", async () => {
      // TODO FIX: expect(received).toBe(expected) // Object.is equality
      // Expected: 2
      // Received: 0
      const customers = [
        new Customer(
          "123",
          "Xavier Palacín Ayuso",
          "cubiczx@hotmail.com",
          1000
        ),
        new Customer(
          "456",
          "Xavier Palacín Ayuso 2",
          "cubiczx2@hotmail.com",
          1500
        ),
      ];

      // Asegúrate de que el mock de findAll devuelva la lista de clientes
      (customerRepository.findAll as jest.Mock).mockResolvedValue(customers);

      const response = await request(app).get("/customers").expect(200);
      expect(response.body.length).toBe(2); // Ahora la respuesta debe contener 2 clientes
      expect(response.body[0].name).toBe("Xavier Palacín Ayuso");
      expect(response.body[1].name).toBe("Xavier Palacín Ayuso 2");
    });

    it("should return an empty array if no customers exist", async () => {
      const response = await request(app).get("/customers").expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe("PUT /customers/:id", () => {
    it("should update an existing customer", async () => {
      const existingCustomer = {
        id: "123",
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      // Create the client previously
      await request(app).post("/customers").send(existingCustomer);

      const updatedCustomer = new Customer(
        "123",
        "Xavier Palacín Ayuso Updated",
        "cubiczxUpdated@hotmail.com",
        2000
      );

      (customerRepository.update as jest.Mock).mockResolvedValue(
        updatedCustomer
      );

      const response = await request(app)
        .put(`/customers/${existingCustomer.id}`)
        .send(updatedCustomer)
        .expect(200);

      expect(response.body.name).toBe("Xavier Palacín Ayuso Updated");
      expect(response.body.email).toBe("cubiczxUpdated@hotmail.com");
    });

    it("should return 404 if customer does not exist", async () => {
      const updatedCustomer = {
        name: "Nonexistent Customer",
        email: "nonexistent@example.com",
        availableCredit: 2000,
      };

      const response = await request(app)
        .put(`/customers/nonexistent-id`)
        .send(updatedCustomer)
        .expect(404);

      expect(response.body.error).toBe("Customer not found.");
    });

    it("should throw InvalidTypeException for email", async () => {
      const existingCustomer = {
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      // Crea un cliente antes de la prueba
      const createResponse = await request(app)
        .post("/customers")
        .send(existingCustomer)
        .expect(201);

      const updatedCustomer = {
        name: "Xavier Palacín Ayuso Updated",
        email: 123, // Invalid type
        availableCredit: 2000,
      };

      const response = await request(app)
        .put(`/customers/${createResponse.body.id}`)
        .send(updatedCustomer)
        .expect(400);

      expect(response.body.error).toBe(
        "Invalid type for property email: expected string, but received number."
      );
    });

    it("should throw InvalidEmailFormatException for invalid email format", async () => {
      // TODO FIX: expected 400 "Bad Request", got 404 "Not Found"
      const existingCustomer = {
        id: "123",
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      await request(app).post("/customers").send(existingCustomer);

      const updatedCustomer = {
        name: "Xavier Palacín Ayuso Updated",
        email: "invalid-email", // Invalid email format
        availableCredit: 2000,
      };

      const response = await request(app)
        .put(`/customers/${existingCustomer.id}`)
        .send(updatedCustomer)
        .expect(400);

      expect(response.body.error).toBe("Invalid email format.");
    });

    it("should throw EmailAlreadyInUseException if email is already used", async () => {
      // TODO Fix expected 400 "Bad Request", got 404 "Not Found"
      const existingCustomer = {
        id: "123",
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      const anotherCustomer = {
        id: "124",
        name: "Another Customer",
        email: "another@mail.com",
        availableCredit: 500,
      };

      await request(app).post("/customers").send(existingCustomer);
      await request(app).post("/customers").send(anotherCustomer);

      const updatedCustomer = {
        name: "Another Customer Updated",
        email: existingCustomer.email, // This email is already in use
        availableCredit: 2000,
      };

      const response = await request(app)
        .put(`/customers/${anotherCustomer.id}`)
        .send(updatedCustomer)
        .expect(409);

      expect(response.body.error).toBe("Email is already in use.");
    });

    it("should throw InvalidTypeException for name", async () => {
      // TODO Fix expected 400 "Bad Request", got 404 "Not Found"
      const existingCustomer = {
        id: "123",
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      await request(app).post("/customers").send(existingCustomer);

      const updatedCustomer = {
        name: 123, // Invalid type
        email: "cubiczx@hotmail.com",
        availableCredit: 2000,
      };

      const response = await request(app)
        .put(`/customers/${existingCustomer.id}`)
        .send(updatedCustomer)
        .expect(400);

      expect(response.body.error).toBe(
        "Invalid type for property name: expected string, but received number."
      );
    });

    it("should throw EmptyNameException if name is empty", async () => {
      // TODO Fix expected 400 "Bad Request", got 404 "Not Found"
      const existingCustomer = {
        id: "123",
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      await request(app).post("/customers").send(existingCustomer);

      const updatedCustomer = {
        name: "", // Empty name
        email: "cubiczx@hotmail.com",
        availableCredit: 2000,
      };

      const response = await request(app)
        .put(`/customers/${existingCustomer.id}`)
        .send(updatedCustomer)
        .expect(400);

      expect(response.body.error).toBe("Name cannot be empty.");
    });

    it("should throw NameTooShortException if name is too short", async () => {
      // TODO Fix expected 400 "Bad Request", got 404 "Not Found"
      const existingCustomer = {
        id: "123",
        name: "Xavier Palacín Ayuso",
        email: "cubiczx@hotmail.com",
        availableCredit: 1000,
      };

      await request(app).post("/customers").send(existingCustomer);

      const updatedCustomer = {
        name: "Ab", // Too short
        email: "cubiczx@hotmail.com",
        availableCredit: 2000,
      };

      const response = await request(app)
        .put(`/customers/${existingCustomer.id}`)
        .send(updatedCustomer)
        .expect(400);

      expect(response.body.error).toBe(
        "Name must be at least 3 characters long."
      );
    });

    it("should throw InvalidTypeException for availableCredit", async () => {
      const validCustomer = {
        name: "Test Customer",
        email: "test@example.com",
        availableCredit: 1000,
      };

      // Crea un cliente
      const createResponse = await request(app)
        .post("/customers")
        .send(validCustomer)
        .expect(201);

      // Intenta actualizar el cliente con un availableCredit inválido
      const updateResponse = await request(app)
        .put(`/customers/${createResponse.body.id}`)
        .send({
          name: "Test Customer Updated",
          email: "test@example.com",
          availableCredit: "invalid-credit", // Tipo incorrecto
        })
        .expect(400);

      expect(updateResponse.body.error).toBe(
        "Invalid type for property amount: expected number, but received string."
      );
    });

    it("should throw NegativeCreditAmountException if availableCredit is negative", async () => {
      const validCustomer = {
        name: "Test Customer",
        email: "test@example.com",
        availableCredit: 1000,
      };

      // Crea un cliente
      const createResponse = await request(app)
        .post("/customers")
        .send(validCustomer)
        .expect(201);

      // Intenta actualizar el cliente con un crédito negativo
      const updateResponse = await request(app)
        .put(`/customers/${createResponse.body.id}`)
        .send({
          name: "Test Customer Updated",
          email: "test@example.com",
          availableCredit: -500, // Crédito negativo
        })
        .expect(452);

      expect(updateResponse.body.error).toBe(
        "Credit amount cannot be negative."
      );
    });
  });

  describe("DELETE /customers/:id", () => {
    it("should delete a customer by id", async () => {
      const customerToDelete = {
        name: "Customer to Delete",
        email: "delete@example.com",
        availableCredit: 1000,
      };

      // Crea un cliente antes de la prueba
      const createResponse = await request(app)
        .post("/customers")
        .send(customerToDelete)
        .expect(201);

      const deleteResponse = await request(app)
        .delete(`/customers/${createResponse.body.id}`)
        .expect(204);

      // Verifica que el cliente haya sido eliminado
      const findResponse = await request(app)
        .get(`/customers/${createResponse.body.id}`)
        .expect(404); // Asegúrate de que ahora devuelva 404
    });

    it("should return 404 if customer does not exist", async () => {
      const response = await request(app)
        .delete(`/customers/nonexistent-id`)
        .expect(404);

      expect(response.body.error).toBe("Customer not found.");
    });

    // TODO TEST InvalidTypeException
  });

  describe("POST /customers/credit", () => {
    it("should throw InvalidTypeException for id", async () => {
      const response = await request(app)
        .post("/customers/credit")
        .send({ id: 123, amount: 100 }) // Invalid type
        .expect(400);

      expect(response.body.error).toBe(
        "Invalid type for property id: expected string, but received number."
      );
    });

    it("should throw CustomerNotFoundException if customer does not exist", async () => {
      const response = await request(app)
        .post("/customers/credit")
        .send({ id: "nonexistent-id", amount: 100 })
        .expect(404);

      expect(response.body.error).toBe("Customer not found.");
    });

    it("should throw InvalidTypeException for amount", async () => {
      // TODO FIX: Expected: "Invalid type for property availableCredit: expected number, but received string."
      // Received: "Invalid type for property email: expected string, but received undefined."

      const existingCustomer = {
        name: "Test Customer",
        email: "test@example.com",
        availableCredit: 1000,
      };

      // Crea un cliente
      const createResponse = await request(app)
        .post("/customers")
        .send(existingCustomer)
        .expect(201);

      const updateResponse = await request(app)
        .put(`/customers/${createResponse.body.id}`)
        .send({ availableCredit: "not-a-number" }) // Invalid type
        .expect(400);

      expect(updateResponse.body.error).toBe(
        "Invalid type for property availableCredit: expected number, but received string."
      );
    });

    it("should throw NegativeCreditAmountException if amount is negative", async () => {
      // TODO FIX: Expected: "Credit amount cannot be negative."
      // Received: "Invalid type for property email: expected string, but received undefined."
      const existingCustomer = {
        name: "Negative Amount Customer",
        email: "negative@example.com",
        availableCredit: 1000,
      };

      // Crea un cliente
      const createResponse = await request(app)
        .post("/customers")
        .send(existingCustomer)
        .expect(201);

      // Intenta actualizar el cliente con un crédito negativo
      const updateResponse = await request(app)
        .put(`/customers/${createResponse.body.id}`)
        .send({ availableCredit: -500 }) // Monto negativo
        .expect(400);

      expect(updateResponse.body.error).toBe(
        "Credit amount cannot be negative."
      );
    });

    it("should return customers sorted by available credit", async () => {
      const customers = [
        { name: "Customer A", email: "a@example.com", availableCredit: 2000 },
        { name: "Customer B", email: "b@example.com", availableCredit: 500 },
      ];

      await request(app).post("/customers").send(customers[0]);
      await request(app).post("/customers").send(customers[1]);

      const response = await request(app)
        .get("/customers/sortByCredit")
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ email: "a@example.com" }),
          expect.objectContaining({ email: "b@example.com" }),
        ])
      );
    });
  });
});
