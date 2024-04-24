import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { I18nService, MailerService } from '@app/common';

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
  TandemClosureNoticeEmailProps,
  TandemPausedUnpausedEmailProps,
} from 'src/core/ports/email.gateway';

@Injectable()
export class SmtpEmailGateway implements EmailGateway {
  constructor(
    private readonly env: ConfigService<Env, true>,
    private readonly i18n: I18nService,
    private readonly mailer: MailerService,
  ) {}

  private get translationNamespace() {
    return this.env.get('EMAIL_TRANSLATION_NAMESPACE') || 'emails';
  }

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
    return this.i18n.translate('footer', {
      ns: this.translationNamespace,
    });
  }

  private translate(
    key: string,
    language: string,
    args?: Record<string, any>,
  ): Record<string, any> {
    const title = this.i18n.translate(`${key}.title`, {
      lng: language,
      ns: this.translationNamespace,
      ...args,
    });
    const bodyHtml = this.i18n.translate(`${key}.bodyHtml`, {
      lng: language,
      ns: this.translationNamespace,
      ...args,
    });
    return { title, bodyHtml };
  }

  async sendWelcomeMail(props: SendWelcomeMailProps): Promise<void> {
    const translations = this.translate('welcome', props.language, {
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
      'newUserRegistrationNotice',
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
      'passwordChangeDenied',
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
    const translations = this.translate('accountBlocked', props.language, {
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

  async sendTandemValidationNoticeEmail(
    props: TandemValidationNoticeEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'tandemValidationNotice',
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
    const translations = this.translate('newTandem', props.language, {
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
    const translations = this.translate('newTandemNotice', props.language, {
      ...props,
    });

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
    const translations = this.translate('tandemCanceled', props.language, {
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

  async sendTandemPausedEmail(
    props: TandemPausedUnpausedEmailProps,
  ): Promise<void> {
    const translations = this.translate('tandemPausedNotice', props.language, {
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

  async sendAdminTandemPausedEmail(
    props: TandemPausedUnpausedEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'tandemPausedAdminNotice',
      props.language,
      {
        ...props,
      },
    );

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'admin',
      variables: {
        links: this.links,
        images: this.images,
        ...translations,
        footer: this.footer,
      },
    });
  }

  async sendTandemUnpausedEmail(
    props: TandemPausedUnpausedEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'tandemUnpausedNotice',
      props.language,
      {
        ...props,
      },
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

  async sendAdminTandemUnpausedEmail(
    props: TandemPausedUnpausedEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'tandemUnpausedAdminNotice',
      props.language,
      {
        ...props,
      },
    );

    await this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'admin',
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
      'tandemCanceledNotice',
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

  async sendTandemClosureNoticeEmail(
    props: TandemClosureNoticeEmailProps,
  ): Promise<void> {
    const translations = this.translate('tandemClosureNotice', props.language, {
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
}
