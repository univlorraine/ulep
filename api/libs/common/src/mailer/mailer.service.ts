import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import { decode } from 'html-entities';
import * as mjml2html from 'mjml';
import { render } from 'mustache';
import { createTransport, Transporter } from 'nodemailer';
import * as path from 'path';

export const MAILER_CONFIGURATION = 'MAILER_CONFIGURATION';

export interface MailerConfiguration {
  host: string;
  port: number;
  secure: boolean;
  ignoreTLS: boolean;
  emailFrom: string;
  templatesPath: string;
  disableBootVerification: boolean;
}

export interface EmailOptions {
  to: string;
  subject: string;
  template: 'admin' | 'user';
  variables: Record<string, any>;
}

@Injectable()
export class MailerService implements OnModuleInit, OnModuleDestroy {
  #transporter: Transporter;
  #logger: Logger;

  constructor(
    @Inject(MAILER_CONFIGURATION) private readonly config: MailerConfiguration,
  ) {
    this.#logger = new Logger('MailerService');
  }

  onModuleInit() {
    this.createTransporter();

    if (!this.config.disableBootVerification) {
      this.verifyTransporter();
    }
  }

  onModuleDestroy() {
    if (this.#transporter && this.#transporter.close) this.#transporter.close();
  }

  private createTransporter() {
    this.#transporter = createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      ignoreTLS: this.config.ignoreTLS,
    });
  }

  private verifyTransporter() {
    return new Promise<void>((resolve, reject) => {
      this.#transporter.verify((error) => {
        if (error) {
          return reject(error);
        } else {
          return resolve();
        }
      });
    });
  }

  public loadTemplate(template: string): string {
    const file = path.join(this.config.templatesPath, `${template}.mjml`);
    const content = fs.readFileSync(file, 'utf8');

    return content;
  }

  public parseTemplate(content: string, args: Record<string, any>): string {
    const template = render(content, args);

    const { html } = mjml2html(template);

    return html;
  }

  public async sendMail(options: EmailOptions): Promise<void> {
    const { to, subject, template, variables } = options;

    const content = this.loadTemplate(template);
    const htmlContent = this.parseTemplate(content, variables);

    const mailOptions = {
      from: this.config.emailFrom,
      to,
      subject: decode(subject),
      html: htmlContent,
    };

    try {
      const result = await this.#transporter.sendMail(mailOptions);
      this.#logger.log(`Email sent: ${result.messageId}`);
    } catch (error) {
      this.#logger.error(`Error sending email: ${error}`);
    }
  }
}
