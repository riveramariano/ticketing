import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator'

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
  (req: Request, res: Response) => {
    // Check the posible validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    const { email, password } = req.body;
    console.log('Creating a user..');
    res.send({});
  }
);

export { router as signUpRouter };
