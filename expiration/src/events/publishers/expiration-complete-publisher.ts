import { Publisher, Subjects, ExpirationCompleteEvent } from '@mrtickers/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
