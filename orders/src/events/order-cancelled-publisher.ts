import { Publisher, Subjects, OrderCancelledEvent } from '@mrtickers/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
