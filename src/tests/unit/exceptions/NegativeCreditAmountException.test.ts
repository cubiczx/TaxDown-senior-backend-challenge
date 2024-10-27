import { NegativeCreditAmountException } from "../../../exceptions/NegativeCreditAmountException";

describe("NegativeCreditAmountException", () => {
  it("should have the correct error message and status code", () => {
    const exception = new NegativeCreditAmountException();

    expect(exception.message).toBe("Credit amount cannot be negative.");
    expect(exception.statusCode).toBe(452);
  });
});
