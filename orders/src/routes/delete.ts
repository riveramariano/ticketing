import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@mrtickers/common';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

// This endpoint actually doesn't delete but update the status to 'Cancelled'
// maybe it will be better if it's a put or patch.
router.delete('/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) { throw new NotFoundError(); }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publishing an event saying this was cancelled!

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
