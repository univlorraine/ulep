import { EmailGateway, SendEmailPayload } from 'src/core/ports/email.gateway';

export default class InMemoryEmailGateway implements EmailGateway {
  #emails: SendEmailPayload[];

  constructor() {
    this.#emails = [];
  }

  send(payload: SendEmailPayload): Promise<void> {
    this.#emails.push(payload);
    console.info('Send email', payload);
    return Promise.resolve();
  }

  bulkSend(payloads: SendEmailPayload[]): Promise<void> {
    this.#emails = [...this.#emails, ...payloads];
    for (const payload of payloads) {
      console.info('Send email', payload);
    }
    return Promise.resolve();
  }
}
