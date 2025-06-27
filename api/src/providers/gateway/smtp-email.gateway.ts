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

import { I18nService, MailerService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';

import {
  AccountBlockedEmailProps,
  ActivityStatusChangeEmailProps,
  EmailGateway,
  EventDeletedEmailProps,
  MessageDeletedEmailProps,
  NewMessageEmailProps,
  NewPartnerEmail,
  NewReportEmailProps,
  NewReportMessageEmailProps,
  NewTandemNoticeEmailProps,
  NewUserRegistrationNoticeEmailProps,
  PasswordChangeDeniedEmailProps,
  SendEmailToSubscribedToEventUserProps,
  SendWelcomeMailProps,
  SessionCanceledEmailProps,
  SessionCreatedEmailProps,
  SessionStartEmailProps,
  SessionUpdatedEmailProps,
  SubscribedToEventEmailProps,
  TandemCanceledEmailProps,
  TandemCanceledNoticeEmailProps,
  TandemClosureNoticeEmailProps,
  TandemPausedUnpausedEmailProps,
  TandemValidationNoticeEmailProps,
  UnsubscribedFromEventEmailProps,
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

  async sendNewMessageEmail(props: NewMessageEmailProps): Promise<void> {
    const translations = this.translate('message', props.language, {
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

  async sendNewReportEmail(props: NewReportEmailProps): Promise<void> {
    const translations = this.translate('report', props.language, {
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
        footer: this.footer,
      },
    });
  }

  async sendNewReportMessageEmail(
    props: NewReportMessageEmailProps,
  ): Promise<void> {
    const translations = this.translate('reportMessage', props.language, {
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
        footer: this.footer,
      },
    });
  }

  async sendActivityPublishedEmail(
    props: ActivityStatusChangeEmailProps,
  ): Promise<void> {
    const translations = this.translate('activityPublished', props.language, {
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
      },
    });
  }

  async sendNewActivityProposalEmail(
    props: ActivityStatusChangeEmailProps,
  ): Promise<void> {
    const translations = this.translate('activityProposal', props.language, {
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
      },
    });
  }

  async sendActivityRejectedEmail(
    props: ActivityStatusChangeEmailProps,
  ): Promise<void> {
    const translations = this.translate('activityRejected', props.language, {
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
      },
    });
  }

  async sendSessionStartEmail(props: SessionStartEmailProps): Promise<void> {
    const translations = this.translate(
      `sessionStart${props.type}`,
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
      },
    });
  }

  async sendSessionCanceledEmail(
    props: SessionCanceledEmailProps,
  ): Promise<void> {
    const translations = this.translate('sessionCanceled', props.language, {
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
      },
    });
  }

  async sendSessionUpdatedEmail(
    props: SessionUpdatedEmailProps,
  ): Promise<void> {
    const translations = this.translate('sessionUpdated', props.language, {
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
      },
    });
  }

  async sendSessionCreatedEmail(
    props: SessionCreatedEmailProps,
  ): Promise<void> {
    const translations = this.translate('sessionCreated', props.language, {
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
      },
    });
  }

  async sendSubscribedToEventEmail(
    props: SubscribedToEventEmailProps,
  ): Promise<void> {
    const translations = this.translate('subscribedToEvent', props.language, {
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
      },
    });
  }

  async sendUnsubscribedFromEventEmail(
    props: UnsubscribedFromEventEmailProps,
  ): Promise<void> {
    const translations = this.translate(
      'unsubscribedFromEvent',
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
      },
    });
  }

  async sendEventDeletedEmail(props: EventDeletedEmailProps): Promise<void> {
    const translations = this.translate('deletedEvent', props.language, {
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
      },
    });
  }

  async sendEmailToSubscribedToEventUser(
    props: SendEmailToSubscribedToEventUserProps,
  ): Promise<void> {
    this.mailer.sendMail({
      to: props.to,
      subject: props.title,
      template: 'user',
      variables: {
        links: this.links,
        images: this.images,
        bodyHtml: props.content,
      },
    });
  }

  async sendMessageDeletedEmail(
    props: MessageDeletedEmailProps,
  ): Promise<void> {
    const translations = this.translate('messageDeleted', props.language, {
      ...props,
    });

    this.mailer.sendMail({
      to: props.to,
      subject: translations.title,
      template: 'user',
      variables: {
        content: props.content,
        roomTitle: props.roomTitle,
      },
      ...translations,
    });
  }
}
