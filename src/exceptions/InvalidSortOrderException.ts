export class InvalidSortOrderException extends Error {
  public statusCode: number;


  constructor() {
    super(
      `Invalid sort order. Use 'asc' or 'desc'.`
    );
    this.statusCode = 400; // Bad Request
  }
}
