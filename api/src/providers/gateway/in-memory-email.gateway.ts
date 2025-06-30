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

/* eslint-disable @typescript-eslint/no-unused-vars */
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

  sendEventDeletedEmail(props: EventDeletedEmailProps): Promise<void> {
    return Promise.resolve();
  }

  sendEmailToSubscribedToEventUser(
    props: SendEmailToSubscribedToEventUserProps,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendMessageDeletedEmail(props: MessageDeletedEmailProps): Promise<void> {
    return Promise.resolve();
  }
}
