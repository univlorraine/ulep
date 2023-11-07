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
      ignoreTLS: smtp.ignoreTLS,
    });
    this.#from = smtp.sender;

    this.logger.log(
      `Smtp email gateway setup with transport ${smtp.host}:${smtp.port}; secure: ${smtp.secure}; from: ${smtp.sender}`,
    );

    if (!smtp.disableBootVerification) {
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
  }

  send({ recipient, email }: SendEmailPayload): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#transporter.sendMail(
        {
          from: this.#from,
          to: recipient,
          subject: email.subject,
          text: email.textContent,
          html: email.content,
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
