/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AccountBlockedEmailProps,
  ActivityStatusChangeEmailProps,
  EmailGateway,
  NewMessageEmailProps,
  NewPartnerEmail,
  NewReportEmailProps,
  NewReportMessageEmailProps,
  NewTandemNoticeEmailProps,
  NewUserRegistrationNoticeEmailProps,
  PasswordChangeDeniedEmailProps,
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

export default class InMemoryEmailGateway implements EmailGateway {
  sendWelcomeMail(props: SendWelcomeMailProps): Promise<void> {
    return Promise.resolve();
  }

  sendNewUserRegistrationNoticeEmail(
    props: NewUserRegistrationNoticeEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendPasswordChangeDeniedEmail(
    props: PasswordChangeDeniedEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendAccountBlockedEmail(props: AccountBlockedEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendTandemValidationNoticeEmail(
    props: TandemValidationNoticeEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendNewPartnerEmail(props: NewPartnerEmail): Promise<void> {
    return Promise.resolve();
  }

  sendNewTandemNoticeEmail(props: NewTandemNoticeEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendTandemCanceledEmail(props: TandemCanceledEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendTandemPausedEmail(props: TandemPausedUnpausedEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendTandemUnpausedEmail(
    props: TandemPausedUnpausedEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendAdminTandemPausedEmail(
    props: TandemPausedUnpausedEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendAdminTandemUnpausedEmail(
    props: TandemPausedUnpausedEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendTandemCanceledNoticeEmail(
    props: TandemCanceledNoticeEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendTandemClosureNoticeEmail(
    props: TandemClosureNoticeEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendNewMessageEmail(props: NewMessageEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendNewReportEmail(props: NewReportEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendNewReportMessageEmail(props: NewReportMessageEmailProps): Promise<void> {
    return Promise.resolve();
  }
  sendNewActivityProposalEmail(
    props: ActivityStatusChangeEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendActivityPublishedEmail(
    props: ActivityStatusChangeEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendActivityRejectedEmail(
    props: ActivityStatusChangeEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendSessionStartEmail(props: SessionStartEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendSessionCanceledEmail(props: SessionCanceledEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendSessionUpdatedEmail(props: SessionUpdatedEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendSessionCreatedEmail(props: SessionCreatedEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendSubscribedToEventEmail(
    props: SubscribedToEventEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendUnsubscribedFromEventEmail(
    props: UnsubscribedFromEventEmailProps,
  ): Promise<void> {
    return Promise.resolve();
  }
}
