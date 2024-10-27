import { InvalidEmailFormatException } from "../../../exceptions/InvalidEmailFormatException";

describe("InvalidEmailFormatException", () => {
  it("should have the correct error message and status code", () => {
    const exception = new InvalidEmailFormatException();
    expect(exception.message).toBe("Invalid email format.");
    expect(exception.statusCode).toBe(400);
  });
});
