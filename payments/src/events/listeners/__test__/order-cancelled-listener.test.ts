import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledEvent, OrderStatus } from '@mrtickers/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setUp = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Creates and saves an order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: '1234',
    price: 20
  });
  await order.save();

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: '1234'
    }
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, order, data, msg };
}

it('updates the status of the order', async () => {
  const { listener, order, data, msg } = await setUp();

  // Call the onMessage function with the data + message
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setUp();

  // Call the onMessage function with the data + message
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
