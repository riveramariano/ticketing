import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@mrtickers/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) { throw new Error('Order not found'); }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    /*
      * TODO: For future implementations it'll be better if we
      * publish an event like OrderUpdated, just to let the others
      * micro-services know about the new version number.
    */

    msg.ack();
  }
}
