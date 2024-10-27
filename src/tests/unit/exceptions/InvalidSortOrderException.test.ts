import { InvalidSortOrderException } from "../../../exceptions/InvalidSortOrderException";

describe("InvalidSortOrderException", () => {
  it("should have the correct error message and status code", () => {
    const exception = new InvalidSortOrderException();
    expect(exception.message).toBe("Invalid sort order. Use 'asc' or 'desc'.");
    expect(exception.statusCode).toBe(400);
  });
});
