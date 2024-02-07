import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { I18nService } from 'nestjs-i18n';
import { MailerService } from '@app/common';

import {
  AccountBlockedEmailProps,
  EmailGateway,
  NewPartnerEmail,
  NewTandemNoticeEmailProps,
  NewUserRegistrationNoticeEmailProps,
  PasswordChangeDeniedEmailProps,
  SendWelcomeMailProps,
  TandemCanceledNoticeEmailProps,
  TandemValidationNoticeEmailProps,
  TandemCanceledEmailProps,
} from 'src/core/ports/email.gateway';

@Injectable()
export class SmtpEmailGateway implements EmailGateway {
  constructor(
    private readonly env: ConfigService<Env, true>,
    private readonly i18n: I18nService,
    private readonly mailer: MailerService,
  ) {}

  private get images() {
    const endpoint = this.env.get('EMAIL_ASSETS_PUBLIC_ENDPOINT');
    const bucket = this.env.get('EMAIL_ASSETS_BUCKET');

    return {
      logo: `${endpoint}/${bucket}/logo.png`,
      background: `${endpoint}/${bucket}/background.png`,
      bubble: `${endpoint}/${bucket}/bonjour-bubble.png`,
      playStore: `${endpoint}/${bucket}/play-store.png`,
      appleStore: `${endpoint}/${bucket}/apple-store.png`,
    };
  }

  private get links() {
    return {
      playStore: this.env.get('APP_LINK_PLAY_STORE'),
      appleStore: this.env.get('APP_LINK_APPLE_STORE'),
    };
  }

  private get footer() {
    return this.i18n.translate('emails.footer');
  }

  private translate(
    key: string,
    language: string,
    args?: Record<string, any>,
  ): Record<string, any> {
    const value = this.i18n.translate(key, { lang: language, args });
    const isObject = typeof value === 'object' && value !== null;
    const hasTitle =
      isObject && 'title' in value && typeof value.title === 'string';
    const hasBody =
      isObject && 'bodyHtml' in value && typeof value.bodyHtml === 'string';

    if (!hasTitle || !hasBody) {
      throw new Error(`Invalid translation for key: ${key}`);
    }

    return value;
  }

  async sendWelcomeMail(props: SendWelcomeMailProps): Promise<void> {
    const translations = this.translate('emails.welcome', props.language, {
      ...props,
    });

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'user',
      variables: {
        links: this.links,
        images: this.images,
        ...translations,
        footer: this.footer,
      },
    });
  }

  async sendNewUserRegistrationNoticeEmail(
    props: NewUserRegistrationNoticeEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'emails.newUserRegistrationNotice',
      props.language,
      { ...props },
    );

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'admin',
      variables: {
        links: this.links,
        images: this.images,
        ...translations,
      },
    });
  }

  async sendPasswordChangeDeniedEmail(
    props: PasswordChangeDeniedEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'emails.passwordChangeDenied',
      props.language,
      { ...props },
    );

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'user',
      variables: {
        links: this.links,
        images: this.images,
        ...translations,
        footer: this.footer,
      },
    });
  }

  async sendAccountBlockedEmail(
    props: AccountBlockedEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'emails.accountBlocked',
      props.language,
      { ...props },
    );

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'user',
      variables: {
        links: this.links,
        images: this.images,
        ...translations,
        footer: this.footer,
      },
    });
  }

  async sendTandemValidationNoticeEmail(
    props: TandemValidationNoticeEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'emails.tandemValidationNotice',
      props.language,
    );

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'admin',
      variables: {
        links: this.links,
        images: this.images,
        ...translations,
      },
    });
  }

  async sendNewPartnerEmail(props: NewPartnerEmail): Promise<void> {
    const translations = this.translate('emails.newTandem', props.language, {
      ...props,
    });

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'user',
      variables: {
        links: this.links,
        images: this.images,
        ...translations,
        footer: this.footer,
      },
    });
  }

  async sendNewTandemNoticeEmail(
    props: NewTandemNoticeEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'emails.newTandemNotice',
      props.language,
      { ...props },
    );

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'admin',
      variables: {
        links: this.links,
        images: this.images,
        ...translations,
      },
    });
  }

  async sendTandemCanceledEmail(
    props: TandemCanceledEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'emails.tandemCanceled',
      props.language,
      { ...props },
    );

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'user',
      variables: {
        links: this.links,
        images: this.images,
        ...translations,
        footer: this.footer,
      },
    });
  }

  async sendTandemCanceledNoticeEmail(
    props: TandemCanceledNoticeEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'emails.tandemCanceledNotice',
      props.language,
      { ...props },
    );

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'admin',
      variables: {
        links: this.links,
        images: this.images,
        ...translations,
      },
    });
  }
}
