import { MongoClient, WithId, Document, ObjectId } from "mongodb";
import { Customer } from "../../../domain/Customer";
import { CustomerRepositoryInterface } from "../../../domain/repositories/CustomerRepositoryInterface";
import { CustomerNotFoundException } from "../../../exceptions/CustomerNotFoundException";

export class MongoDBCustomerRepository implements CustomerRepositoryInterface {
  private client: MongoClient;
  private dbName: string;
  private collectionName: string;

  /**
   * Initializes a new instance of the MongoDBCustomerRepository class.
   * @param uri The URI of the MongoDB server.
   * @param dbName The name of the database to use.
   * @param collectionName The name of the collection to interact with.
   */
  constructor(uri: string, dbName: string, collectionName: string) {
    this.client = new MongoClient(uri);
    this.dbName = dbName;
    this.collectionName = collectionName;
  }

  /**
   * Establishes a connection to the MongoDB server.
   * The connection is not closed until disconnect is called.
   * @returns A promise that resolves when the connection is established.
   */
  async connect() {
    await this.client.connect();
  }

  /**
   * Closes the connection to the MongoDB server.
   * This should be called to release database resources
   * when operations are complete.
   * @returns A promise that resolves when the connection is closed.
   */

  async disconnect() {
    await this.client.close();
  }

  /**
   * Creates a new customer with the given information.
   * @param customer The customer to create.
   * @returns A promise that resolves when the customer is created.
   */
  async create(customer: Customer): Promise<Customer> {
    await this.connect();
    const db = this.client.db(this.dbName);
    await db.collection(this.collectionName).insertOne(customer);
    return customer;
  }

  /**
   * Retrieves a list of all customers from the repository.
   * @returns A promise that resolves to a list of all customers
   */
  async findAll(): Promise<Customer[]> {
    await this.connect();
    const db = this.client.db(this.dbName);
    const customers = await db.collection(this.collectionName).find().toArray();
    return customers.map((customer: WithId<Document>) => ({
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      availableCredit: customer.availableCredit,
    }));
  }

  /**
   * Retrieves a customer by ID.
   * @param id The ID of the customer to find.
   * @returns A promise that resolves to the customer if found, or undefined if not.
   */
  async findById(id: string): Promise<Customer | undefined> {
    await this.connect();
    const db = this.client.db(this.dbName);
    const customer = await db
      .collection(this.collectionName)
      .findOne({ _id: new ObjectId(id) });
    return customer
      ? {
          id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          availableCredit: customer.availableCredit,
        }
      : undefined;
  }

  /**
   * Retrieves a customer by email.
   * @param email The email of the customer to find.
   * @returns A promise that resolves to the customer if found, or undefined if not.
   */
  async findByEmail(email: string): Promise<Customer | undefined> {
    await this.connect();
    const db = this.client.db(this.dbName);
    const customer = await db
      .collection(this.collectionName)
      .findOne({ email });
    return customer
      ? {
          id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          availableCredit: customer.availableCredit,
        }
      : undefined;
  }

  /**
   * Updates a customer in the repository.
   * @param customer The customer to update.
   * @returns A promise that resolves to the updated customer if found, or throws CustomerNotFoundException if not.
   */
  async update(customer: Customer): Promise<Customer> {
    await this.connect();
    const db = this.client.db(this.dbName);
    const objectId = new ObjectId(customer.id);

    const result = await db.collection(this.collectionName).findOneAndUpdate(
      //{ _id: new ObjectId(customer.id) }, // Asegúrate de que el ID sea un ObjectId
      { _id: objectId },
      {
        $set: {
          name: customer.name,
          email: customer.email,
          availableCredit: customer.availableCredit,
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new CustomerNotFoundException();
    }

    return {
      id: result._id.toString(),
      name: result.name,
      email: result.email,
      availableCredit: result.availableCredit,
    };
  }

  /**
   * Deletes a customer by ID.
   * @param id The ID of the customer to delete.
   * @returns A promise that resolves when the customer is deleted.
   * @throws CustomerNotFoundException if the customer does not exist.
   */
  async delete(id: string): Promise<void> {
    await this.connect();
    const db = this.client.db(this.dbName);
    const result = await db
      .collection(this.collectionName)

      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new CustomerNotFoundException();
    }
  }

  /**
   * Retrieves a list of customers with available credit greater than or equal to the specified amount.
   * @param minCredit The minimum available credit to filter customers by.
   * @returns A promise that resolves to an array of customers meeting the credit criteria.
   */
  async findByAvailableCredit(minCredit: number): Promise<Customer[]> {
    await this.connect();
    const db = this.client.db(this.dbName);
    const customers = await db
      .collection(this.collectionName)
      .find({ availableCredit: { $gte: minCredit } })
      .toArray();
    return customers.map((customer: WithId<Document>) => ({
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      availableCredit: customer.availableCredit,
    }));
  }

  /**
   * Clears all customers from the repository.
   * This is mainly for testing purposes.
   * @returns A promise that resolves when all customers have been cleared.
   */
  public async clear(): Promise<void> {
    await this.connect();
    const db = this.client.db(this.dbName);
    await db.collection(this.collectionName).deleteMany({});
  }
}
