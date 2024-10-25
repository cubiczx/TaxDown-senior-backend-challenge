import { Customer } from "../Customer";

export interface CustomerRepositoryInterface {
  create(customer: Customer): Promise<Customer>;
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | undefined>;
  findByEmail(email: string): Promise<Customer | undefined>;
  update(customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
  //addCredit(id: string, amount: number): Promise<Customer | null>;
  findByAvailableCredit(minCredit: number): Promise<Customer[]>;
  //sortCustomersByCredit(order: string): Promise<Customer[]>;
  clear(): Promise<void>;
}
