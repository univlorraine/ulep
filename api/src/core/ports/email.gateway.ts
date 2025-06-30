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

export interface ActivityStatusChangeEmailProps {
  to: string;
  language: string;
  user: { firstname: string; lastname: string };
  activity: { title: string };
}

export interface SubscribedToEventEmailProps {
  to: string;
  language: string;
  user: UserParams;
  event: {
    title: string;
    authorUniversity: string;
    date: string;
  };
}

export interface UnsubscribedFromEventEmailProps {
  to: string;
  language: string;
  user: UserParams;
  event: {
    title: string;
    authorUniversity: string;
    date: string;
  };
}

export interface EventDeletedEmailProps {
  to: string;
  language: string;
  user?: UserParams;
  event: {
    title: string;
    authorUniversity: string;
    date: string;
  };
}

export interface SendEmailToSubscribedToEventUserProps {
  to: string;
  title: string;
  content: string;
}

export interface MessageDeletedEmailProps {
  to: string;
  language: string;
  roomTitle: string;
  content: string;
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

  // Notifies university about an activity proposal
  sendNewActivityProposalEmail(
    props: ActivityStatusChangeEmailProps,
  ): Promise<void>;

  // Notifies user about an activity publication
  sendActivityPublishedEmail(
    props: ActivityStatusChangeEmailProps,
  ): Promise<void>;

  // Notifies user about an activity rejection
  sendActivityRejectedEmail(
    props: ActivityStatusChangeEmailProps,
  ): Promise<void>;
  // Notifies users about a session start
  sendSessionStartEmail(props: SessionStartEmailProps): Promise<void>;

  // Notifies users about a session cancellation
  sendSessionCanceledEmail(props: SessionCanceledEmailProps): Promise<void>;

  // Notifies users about a session update
  sendSessionUpdatedEmail(props: SessionUpdatedEmailProps): Promise<void>;

  // Notifies users about a session creation
  sendSessionCreatedEmail(props: SessionCreatedEmailProps): Promise<void>;

  // Notifies users about being subscribed to an event
  sendSubscribedToEventEmail(props: SubscribedToEventEmailProps): Promise<void>;

  // Notifies users about being unsubscribed from an event
  sendUnsubscribedFromEventEmail(
    props: UnsubscribedFromEventEmailProps,
  ): Promise<void>;

  // Notifies users about an event deletion

  sendEventDeletedEmail(props: EventDeletedEmailProps): Promise<void>;

  // Notifies users about an event deletion
  sendEventDeletedEmail(props: EventDeletedEmailProps): Promise<void>;

  // Notifies users about an event email
  sendEmailToSubscribedToEventUser(
    props: SendEmailToSubscribedToEventUserProps,
  ): Promise<void>;

  sendMessageDeletedEmail(props: MessageDeletedEmailProps): Promise<void>;
}
