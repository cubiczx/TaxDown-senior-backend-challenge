import { CustomerNotFoundException } from "../../../exceptions/CustomerNotFoundException";

describe("CustomerNotFoundException", () => {
  it("should have the correct error message and status code", () => {
    const exception = new CustomerNotFoundException();
    expect(exception.message).toBe("Customer not found.");
    expect(exception.statusCode).toBe(404);
  });
});