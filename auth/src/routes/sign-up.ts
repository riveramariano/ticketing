import express, { Request, Response } from 'express';
import { body } from 'express-validator'
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@mrtickers/common';

import { User } from '../models/user';

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);

    // Store it on session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
