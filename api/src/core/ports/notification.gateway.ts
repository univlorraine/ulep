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

export const NOTIFICATION_GATEWAY = 'notification.gateway';

export interface Notification {
  token: string;
  language: string;
}

export type NotificationParams = {
  to: Notification[];
};

export type NotificationFunction = (
  params: NotificationParams,
) => Promise<void>;

export interface SendTandemClosureNoticeNotification {
  to: Notification[];
  university: {
    name: string;
    closeDate: string;
  };
}

export interface SendMessageNotification {
  to: Notification[];
  content: string;
  sender: {
    firstname: string;
    lastname: string;
  };
}

export interface SendActivityStatusChangeNotification {
  to: Notification[];
  activity: {
    title: string;
  };
}

type SessionParams = {
  date: string;
  hour: string;
  partnerName: string;
};

export interface SendSessionStartNotification {
  to: Notification[];
  type: 'FifteenMinutes' | 'Daily';
  session: SessionParams;
}

export interface SendSessionCanceledNotification {
  to: Notification[];
  session: SessionParams;
}

export interface SendSessionCreatedNotification {
  to: Notification[];
  session: SessionParams;
}

export interface SendSessionUpdatedNotification {
  to: Notification[];
  session: SessionParams;
}

export interface NotificationGateway {
  sendTandemClosureNoticeNotification(
    props: SendTandemClosureNoticeNotification,
  ): Promise<void>;
  sendWelcomeNotification: NotificationFunction;
  sendPausedTandemNotification: NotificationFunction;
  sendUnpausedTandemNotification: NotificationFunction;
  sendMessageNotification(props: SendMessageNotification): Promise<void>;
  sendActivityRejectedNotification(
    props: SendActivityStatusChangeNotification,
  ): Promise<void>;
  sendActivityPublishedNotification(
    props: SendActivityStatusChangeNotification,
  ): Promise<void>;
  sendSessionStartNotification(
    props: SendSessionStartNotification,
  ): Promise<void>;
  sendSessionCanceledNotification(
    props: SendSessionCanceledNotification,
  ): Promise<void>;
  sendSessionCreatedNotification(
    props: SendSessionCreatedNotification,
  ): Promise<void>;
  sendSessionUpdatedNotification(
    props: SendSessionUpdatedNotification,
  ): Promise<void>;
}
