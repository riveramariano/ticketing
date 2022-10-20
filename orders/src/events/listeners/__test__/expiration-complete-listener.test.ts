import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { OrderStatus, ExpirationCompleteEvent } from '@mrtickers/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setUp = async () => {
  // Create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 50
  });
  await ticket.save();

  // Create and save an order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: '1234',
    expiresAt: new Date(),
    ticket
  });
  await order.save();

   // Create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, order, data, msg };
}

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setUp();

  // Call the onMessage function with the data + message
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setUp();

  // Call the onMessage function with the data + message
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setUp();

  // Call the onMessage function with the data + message
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
