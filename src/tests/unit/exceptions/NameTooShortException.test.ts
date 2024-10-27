import { NameTooShortException } from "../../../exceptions/NameTooShortException";

describe("NameTooShortException", () => {
  it("should have the correct error message and status code", () => {
    const exception = new NameTooShortException();

    expect(exception.message).toBe("Name must be at least 3 characters long.");
    expect(exception.statusCode).toBe(400);
  });
});
