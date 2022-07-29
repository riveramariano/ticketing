import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  constructor(errors: ValidationError[]) {
    super();

    // Only beacause we're extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
