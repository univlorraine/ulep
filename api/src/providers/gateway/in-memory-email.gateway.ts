/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AccountBlockedEmailProps,
  EmailGateway,
  NewMessageEmailProps,
  NewPartnerEmail,
  NewTandemNoticeEmailProps,
  NewUserRegistrationNoticeEmailProps,
  PasswordChangeDeniedEmailProps,
  SendWelcomeMailProps,
  TandemCanceledEmailProps,
  TandemCanceledNoticeEmailProps,
  TandemClosureNoticeEmailProps,
  TandemPausedUnpausedEmailProps,
  TandemValidationNoticeEmailProps,
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
}
