import { EmailAlreadyInUseException } from "../../../exceptions/EmailAlreadyInUseException";

describe("EmailAlreadyInUseException", () => {
  it("should have the correct error message and status code", () => {
    const exception = new EmailAlreadyInUseException();
    expect(exception.message).toBe("Email is already in use.");
    expect(exception.statusCode).toBe(409);
  });
});
