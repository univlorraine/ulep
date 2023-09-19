import { EmailGateway, SendEmailPayload } from 'src/core/ports/email.gateway';
import { Transporter, createTransport } from 'nodemailer';
import { configuration } from 'src/configuration';
import { Logger } from '@nestjs/common';

export class SmtpEmailGateway implements EmailGateway {
  private readonly logger = new Logger(SmtpEmailGateway.name);

  #transporter: Transporter;
  #from: string;

  constructor() {
    const { smtp } = configuration();

    this.#transporter = createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
    });
    this.#from = smtp.sender;

    this.logger.debug(
      `Smtp email gateway setup with transport ${smtp.host}:${smtp.port}; secure: ${smtp.secure}; from: ${smtp.sender}`,
    );

    new Promise<void>((resolve, reject) => {
      this.#transporter.verify((error) => {
        if (error) {
          this.logger.error('Fail to verify smtp connection', error);
          return reject(error);
        } else {
          this.logger.log('SMTP Email gateway ready to take messages');
          return resolve();
        }
      });
    });
  }

  send({ recipient, subject, content }: SendEmailPayload): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#transporter.sendMail(
        {
          from: this.#from,
          to: recipient,
          subject,
          text: content,
          html: `<html><p>${content}</p></html>`,
        },
        (err: Error) => {
          if (err) {
            this.logger.error(err);
            return reject(err);
          }

          return resolve();
        },
      );
    });
  }

  async bulkSend(payloads: SendEmailPayload[]): Promise<void> {
    await Promise.all(payloads.map((payload) => this.send(payload)));
  }
}
