import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth, NotFoundError, NotAuthorizedError } from '@mrtickers/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id',
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) { throw new NotFoundError(); }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
