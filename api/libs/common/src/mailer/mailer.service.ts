import * as fs from 'fs';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import mjml from 'mjml';

export const MAILER_CONFIGURATION = 'MAILER_CONFIGURATION';

export interface MailerConfiguration {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  variables: Record<string, string>;
}

@Injectable()
export class MailerService implements OnModuleInit, OnModuleDestroy {
  #transporter: Transporter;
  #templates: Record<string, string> = {};
  #logger: Logger;

  constructor(
    @Inject(MAILER_CONFIGURATION) private readonly config: MailerConfiguration,
  ) {
    this.#logger = new Logger('MailerService');
  }

  onModuleInit() {
    this.createTransporter();
  }

  onModuleDestroy() {
    this.#transporter.close();
  }

  private createTransporter() {
    this.#transporter = createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      ignoreTLS: true,
    });
  }

  private loadTemplate(template: string): string {
    if (!this.#templates[template]) {
      const templatePath = `./templates/${template}.mjml`;
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      this.#templates[template] = templateContent;
    }

    return this.#templates[template];
  }

  private parseTemplate(content: string, args: Record<string, string>): string {
    Object.keys(args).forEach((key) => {
      const re = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(re, args[key]);
    });

    const { html } = mjml(content);

    return html;
  }

  public async sendMail(options: EmailOptions): Promise<void> {
    const { to, subject, template, variables } = options;

    const content = this.loadTemplate(template);
    const htmlContent = this.parseTemplate(content, variables);

    const mailOptions = {
      from: this.config.auth.user,
      to,
      subject,
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
