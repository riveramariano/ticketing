import { Publisher, Subjects, TicketUpdatedEvent } from '@mrtickers/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
