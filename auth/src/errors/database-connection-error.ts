export class DatabaseConnectionError extends Error {
  reason = 'Error connection to data base';
  constructor() {
    super();

    // Only beacause we're extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
