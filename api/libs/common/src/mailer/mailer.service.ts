/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
