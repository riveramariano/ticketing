import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  requireAuth,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from '@mrtickers/common';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('Stripe Token is required'),
    body('orderId').not().isEmpty().withMessage('OrderId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) { 
      throw new NotFoundError(); 
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancalled order');
    }

    

    res.status(201).send({});
  }
);

export { router as createChargeRouter };
