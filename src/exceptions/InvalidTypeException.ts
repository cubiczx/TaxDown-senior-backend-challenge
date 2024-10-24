export class InvalidTypeException extends Error {
  public statusCode: number;

  /**
   * Constructor for InvalidTypeException class.
   * @param propertyName The name of the property whose type is invalid.
   * @param expectedType The type that was expected for the property.
   * @param receivedValue The value that was received for the property.
   */
  constructor(propertyName: string, expectedType: string, receivedValue: any) {
    super(
      `Invalid type for property ${propertyName}: expected ${expectedType}, but received ${typeof receivedValue}.`
    );
    this.statusCode = 400; // Bad Request
  }
}
