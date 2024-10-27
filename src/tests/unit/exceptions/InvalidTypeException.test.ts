import { InvalidTypeException } from "../../../exceptions/InvalidTypeException";

describe("InvalidTypeException", () => {
  it("should have the correct error message and status code", () => {
    const propertyName = "age";
    const expectedType = "number";
    const receivedValue = "twenty";

    const exception = new InvalidTypeException(propertyName, expectedType, receivedValue);

    expect(exception.message).toBe(
      `Invalid type for property ${propertyName}: expected ${expectedType}, but received ${typeof receivedValue}.`
    );
    expect(exception.statusCode).toBe(400);
  });
});
