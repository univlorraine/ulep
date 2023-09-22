import EmailContent from '../models/email-content.model';

export const EMAIL_GATEWAY = 'email.gateway';

export interface SendEmailPayload {
  recipient: string;
  email: EmailContent;
}

export interface EmailGateway {
  send(payload: SendEmailPayload): Promise<void>;

  bulkSend(payloads: SendEmailPayload[]): Promise<void>;
}
