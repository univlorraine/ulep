export const EMAIL_GATEWAY = 'email.gateway';

type UserParams = {
  firstname: string;
  lastname: string;
};

type UserParamsWithUniversity = UserParams & {
  university: string;
};

type SessionParams = {
  date: string;
  hour: string;
  partnerName: string;
  comment: string;
};

export interface SendWelcomeMailProps {
  to: string;
  language: string;
  user: UserParams;
}

export interface NewUserRegistrationNoticeEmailProps {
  to: string;
  language: string;
  user: UserParams;
}

export interface PasswordChangeDeniedEmailProps {
  to: string;
  language: string;
  user: UserParams;
}

export interface AccountBlockedEmailProps {
  to: string;
  language: string;
  user: UserParams;
}

export interface TandemValidationNoticeEmailProps {
  to: string;
  language: string;
}

export interface NewPartnerEmail {
  to: string;
  language: string;
  user: UserParamsWithUniversity;
  partner: UserParamsWithUniversity;
}

export interface NewTandemNoticeEmailProps {
  to: string;
  language: string;
  user: UserParamsWithUniversity;
  partner: UserParamsWithUniversity;
}

export interface TandemCanceledEmailProps {
  to: string;
  language: string;
  user: UserParamsWithUniversity;
  partner: UserParamsWithUniversity;
}

export interface TandemPausedUnpausedEmailProps {
  to: string;
  language: string;
  user: UserParamsWithUniversity;
  partner: UserParamsWithUniversity;
}

export interface TandemCanceledNoticeEmailProps {
  to: string;
  language: string;
  user: UserParamsWithUniversity;
  partner: UserParamsWithUniversity;
}

export interface TandemClosureNoticeEmailProps {
  to: string;
  language: string;
  user: UserParams;
  university: { name: string; closeDate: string };
}
export type TandemPausedUnpausedFunction = (
  params: TandemPausedUnpausedEmailProps,
) => Promise<void>;

export interface NewMessageEmailProps {
  to: string;
  language: string;
  content: string;
  user: UserParams;
  sender: UserParams;
}

export interface NewReportEmailProps {
  to: string;
  language: string;
  reportType: string;
  user: UserParams;
}

export interface NewReportMessageEmailProps {
  to: string;
  language: string;
  reportType: string;
  user: UserParams;
  reportedUser: UserParams;
}

export interface SessionStartEmailProps {
  to: string;
  language: string;
  user: UserParams;
  session: SessionParams;
  type: 'FifteenMinutes' | 'Daily';
}

export interface SessionCanceledEmailProps {
  to: string;
  language: string;
  user: UserParams;
  session: SessionParams;
}

export interface SessionUpdatedEmailProps {
  to: string;
  language: string;
  user: UserParams;
  session: SessionParams;
}

export interface SessionCreatedEmailProps {
  to: string;
  language: string;
  user: UserParams;
  session: SessionParams;
}

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

  // Notifies the user about the closure of the university
  sendTandemClosureNoticeEmail(
    props: TandemClosureNoticeEmailProps,
  ): Promise<void>;

  // Notifies users about a new message
  sendNewMessageEmail(props: NewMessageEmailProps): Promise<void>;

  // Notifies users about a new report
  sendNewReportEmail(props: NewReportEmailProps): Promise<void>;

  // Notifies users about a new report message
  sendNewReportMessageEmail(props: NewReportMessageEmailProps): Promise<void>;

  // Notifies users about a session start
  sendSessionStartEmail(props: SessionStartEmailProps): Promise<void>;

  // Notifies users about a session cancellation
  sendSessionCanceledEmail(props: SessionCanceledEmailProps): Promise<void>;

  // Notifies users about a session update
  sendSessionUpdatedEmail(props: SessionUpdatedEmailProps): Promise<void>;

  // Notifies users about a session creation
  sendSessionCreatedEmail(props: SessionCreatedEmailProps): Promise<void>;
}
