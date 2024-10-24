export interface CustomError extends Error {
  statusCode: number;
}

/**
 * Checks if the given error is a CustomError.
 * A CustomError is an Error that contains a statusCode property.
 * @param error The error to check.
 * @returns true if the error is a CustomError, false otherwise.
 */
export function isCustomError(error: any): error is CustomError {
  return (
    error &&
    typeof error.statusCode === "number" &&
    typeof error.message === "string"
  );
}
