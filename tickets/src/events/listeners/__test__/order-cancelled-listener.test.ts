import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledEvent } from '@mrtickers/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setUp = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'Concert',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString()
  });
  ticket.set({ orderId });
  await ticket.save();

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, orderId, ticket, data, msg };
}

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, ticket, data, msg } = await setUp();

  // Call the onMessage function with the data + message
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
