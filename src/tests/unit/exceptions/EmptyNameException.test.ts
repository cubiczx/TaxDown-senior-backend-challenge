import { EmptyNameException } from "../../../exceptions/EmptyNameException";

describe("EmptyNameException", () => {
  it("should have the correct error message and status code", () => {
    const exception = new EmptyNameException();
    expect(exception.message).toBe("Name cannot be empty.");
    expect(exception.statusCode).toBe(400);
  });
});
