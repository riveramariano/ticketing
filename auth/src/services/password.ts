import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  /**
   * It takes a password, generates a random salt, and then uses the scryptAsync function to generate a
   * hash
   * @param {string} password - The password to hash
   * @returns The return value is a string that is the result of the scryptAsync function.
   */
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buff = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buff.toString('hex')}.${salt}`;
  }

  /**
   * This function takes a stored password and a supplied password, splits the stored password into a
   * hash and a salt, then hashes the supplied password with the salt and compares the result to the
   * stored hash.
   * @param {string} storedPassword - The password that was stored in the database.
   * @param {string} suppliedPassword - The password that the user is trying to log in with.
   * @returns The return value is a boolean.
   */
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buff.toString('hex') === hashedPassword;
  }
}
