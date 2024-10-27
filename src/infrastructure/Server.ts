import express, { Request, Response, NextFunction } from "express";
import { CustomerService } from "../application/CustomerService";
import { InMemoryCustomerRepository } from "./persistence/repositories/InMemoryCustomerRepository";
import { CustomerController } from "../interfaces/controllers/CustomerController";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Express
export const app = express(); // Named export
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
  },
  apis: ["./src/interfaces/controllers/*.ts"], // Path to the API docs
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Configuring Services and Drivers
const customerRepository = new InMemoryCustomerRepository();

app.locals.customerRepository = customerRepository;
const customerService = new CustomerService(app.locals.customerRepository);

const customerController = new CustomerController(customerService);

// Definition of routes
app.post("/customers", (req: Request, res: Response) =>
  customerController.createCustomer(req, res)
);
app.get("/customers", (req: Request, res: Response) =>
  customerController.listCustomers(req, res)
);
app.get("/customers/sortByCredit", (req: Request, res: Response) =>
  customerController.sortCustomersByCredit(req, res)
);
app.get("/customers/:id", (req: Request, res: Response) =>
  customerController.getCustomerById(req, res)
);
app.put("/customers/:id", (req: Request, res: Response) =>
  customerController.updateCustomer(req, res)
);
app.delete("/customers/:id", (req: Request, res: Response) =>
  customerController.deleteCustomer(req, res)
);
app.post("/customers/credit", (req: Request, res: Response) =>
  customerController.addCredit(req, res)
);

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT || 3000; // Use PORT from .env or fallback to 3000
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(
      `API documentation available at http://localhost:${PORT}/api-docs`
    );
  });
}
