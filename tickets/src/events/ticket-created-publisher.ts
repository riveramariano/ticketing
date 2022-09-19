import { Publisher, Subjects, TicketCreatedEvent } from '@mrtickers/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
