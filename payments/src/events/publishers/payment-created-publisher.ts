import { Publisher, Subjects, PaymentCreatedEvent } from "@mrtickers/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
