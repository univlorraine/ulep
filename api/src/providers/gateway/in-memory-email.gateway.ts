import { Logger } from '@nestjs/common';
import { EmailGateway, SendEmailPayload } from 'src/core/ports/email.gateway';

export default class InMemoryEmailGateway implements EmailGateway {
  private readonly logger = new Logger(InMemoryEmailGateway.name);

  #emails: SendEmailPayload[];

  constructor() {
    this.#emails = [];
  }

  send(payload: SendEmailPayload): Promise<void> {
    this.#emails.push(payload);
    this.logger.debug('Send email', payload);
    return Promise.resolve();
  }

  bulkSend(payloads: SendEmailPayload[]): Promise<void> {
    this.#emails = [...this.#emails, ...payloads];
    for (const payload of payloads) {
      this.logger.debug('Send email', payload);
    }
    return Promise.resolve();
  }
}
