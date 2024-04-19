export const EMAIL_GATEWAY = 'email.gateway';

export interface SendWelcomeMailProps {
  to: string;
  language: string;
  user: { firstname: string; lastname: string };
}

export interface NewUserRegistrationNoticeEmailProps {
  to: string;
  language: string;
  user: { firstname: string; lastname: string };
}

export interface PasswordChangeDeniedEmailProps {
  to: string;
  language: string;
  user: { firstname: string; lastname: string };
}

export interface AccountBlockedEmailProps {
  to: string;
  language: string;
  user: { firstname: string; lastname: string };
}

export interface TandemValidationNoticeEmailProps {
  to: string;
  language: string;
}

export interface NewPartnerEmail {
  to: string;
  language: string;
  user: { firstname: string; lastname: string; university: string };
  partner: { firstname: string; lastname: string; university: string };
}

export interface NewTandemNoticeEmailProps {
  to: string;
  language: string;
  user: { firstname: string; lastname: string; university: string };
  partner: { firstname: string; lastname: string; university: string };
}

export interface TandemCanceledEmailProps {
  to: string;
  language: string;
  user: { firstname: string; lastname: string; university: string };
  partner: { firstname: string; lastname: string; university: string };
}

export interface TandemPausedUnpausedEmailProps {
  to: string;
  language: string;
  user: { firstname: string; lastname: string; university: string };
  partner: { firstname: string; lastname: string; university: string };
}

export interface TandemCanceledNoticeEmailProps {
  to: string;
  language: string;
  user: { firstname: string; lastname: string; university: string };
  partner: { firstname: string; lastname: string; university: string };
}

export type TandemPausedUnpausedFunction = (
  params: TandemPausedUnpausedEmailProps,
) => Promise<void>;

export interface EmailGateway {
  // Notifies a user with a welcome email.
  sendWelcomeMail(props: SendWelcomeMailProps): Promise<void>;

  // Notifies the administrator about a new user registration within the organization.
  sendNewUserRegistrationNoticeEmail(
    props: NewUserRegistrationNoticeEmailProps,
  ): Promise<void>;

  // Notifies a user that their password cant be changed.
  sendPasswordChangeDeniedEmail(
    props: PasswordChangeDeniedEmailProps,
  ): Promise<void>;

  // Notifies a user that their account has been blocked.
  sendAccountBlockedEmail(props: AccountBlockedEmailProps): Promise<void>;

  // Notifies the administrator that a Tandem is pending validation
  sendTandemValidationNoticeEmail(
    props: TandemValidationNoticeEmailProps,
  ): Promise<void>;

  // Notifies a user that a new Tandem has been established.
  sendNewPartnerEmail(props: NewPartnerEmail): Promise<void>;

  // Notifies the administrator about the formation of a new Tandem, including details about the users involved.
  sendNewTandemNoticeEmail(props: NewTandemNoticeEmailProps): Promise<void>;

  // Notifies a user that their Tandem has been ended.
  sendTandemCanceledEmail(props: TandemCanceledEmailProps): Promise<void>;

  // Notifies an user that their Tandem has been paused.
  sendTandemPausedEmail: TandemPausedUnpausedFunction;

  // Notifies an admin that a Tandem has been paused.
  sendAdminTandemPausedEmail: TandemPausedUnpausedFunction;

  // Notifies a user that their Tandem has been unpaused.
  sendTandemUnpausedEmail: TandemPausedUnpausedFunction;

  // Notifies an admin that a Tandem has been unpaused.
  sendAdminTandemUnpausedEmail: TandemPausedUnpausedFunction;

  // Notifies the administrator about the dissolution of a Tandem.
  sendTandemCanceledNoticeEmail(
    props: TandemCanceledNoticeEmailProps,
  ): Promise<void>;
}
