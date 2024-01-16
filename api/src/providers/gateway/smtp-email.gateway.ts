import { EmailGateway, SendEmailPayload } from 'src/core/ports/email.gateway';
import { Transporter, createTransport } from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';

@Injectable()
export class SmtpEmailGateway implements EmailGateway {
  #transporter: Transporter;
  #from: string;

  constructor(env: ConfigService<Env, true>) {
    const smtp = {
      host: env.get<string>('SMTP_HOST'),
      port: env.get<number>('SMTP_PORT'),
      secure: env.get<boolean>('SMTP_SECURE'),
      ignoreTLS: env.get<boolean>('SMTP_IGNORE_TLS'),
      sender: env.get<string>('SMTP_SENDER'),
      disableBootVerification: env.get<boolean>(
        'SMTP_DISABLE_BOOT_VERIFICATION',
      ),
    };

    this.#transporter = createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      ignoreTLS: smtp.ignoreTLS,
    });
    this.#from = smtp.sender;

    if (!smtp.disableBootVerification) {
      new Promise<void>((resolve, reject) => {
        this.#transporter.verify((error) => {
          if (error) {
            return reject(error);
          } else {
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
