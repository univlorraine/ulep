export const EMAIL_GATEWAY = 'email.gateway';

export interface SendEmailPayload {
  recipient: string;
  subject: string;
  content: string;
}

export interface EmailGateway {
  send(payload: SendEmailPayload): Promise<void>;

  bulkSend(payloads: SendEmailPayload[]): Promise<void>;
}
