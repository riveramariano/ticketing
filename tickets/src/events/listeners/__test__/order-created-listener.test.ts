import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@mrtickers/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setUp = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'Concert',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: '1234',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg };
}

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setUp();

  // Call the onMessage function with the data + message
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setUp();

  // Call the onMessage function with the data + message
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setUp();

  // Call the onMessage function with the data + message
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function is called
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdated = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(data.id).toEqual(ticketUpdated.orderId);
});
