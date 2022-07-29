import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post('/api/users/sign-up',
  [
    body('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 16, max: 40 })
      .withMessage('Password must be between 16 and 40 characters')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    console.log('Creating a new user...');
    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signUpRouter };
