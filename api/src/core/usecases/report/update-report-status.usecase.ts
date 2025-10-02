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

import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import { EmailGateway, EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import {
  NotificationGateway,
  NOTIFICATION_GATEWAY,
} from 'src/core/ports/notification.gateway';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';
import { ChatService } from 'src/providers/services/chat.service';
import { ReportStatus } from '../../models';
import {
  ReportRepository,
  REPORT_REPOSITORY,
} from '../../ports/report.repository';

import { GetProfileByUserIdUsecase } from '../profiles';

export class UpdateReportStatusCommand {
  id: string;
  status: ReportStatus;
  comment?: string;
  shouldDeleteMessage?: boolean;
}

@Injectable()
export class UpdateReportStatusUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly notificationGateway: NotificationGateway,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    private readonly getProfileByUserIdUsecase: GetProfileByUserIdUsecase,
  ) {}

  async execute(command: UpdateReportStatusCommand) {
    const instance = await this.reportRepository.reportOfId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    if (
      command.shouldDeleteMessage !== undefined &&
      command.shouldDeleteMessage !== instance.metadata?.isMessageDeleted &&
      instance.metadata?.messageId
    ) {
      await this.chatService.deleteMessage(
        instance.metadata?.messageId,
        command.shouldDeleteMessage,
      );

      // Récupérer l'auteur du message via le messageId
      const message = await this.chatService.getMessageById(
        instance.metadata?.messageId,
      );

      if (message && message.ownerId) {
        const messageAuthorProfile =
          await this.getProfileByUserIdUsecase.execute({
            id: message.ownerId,
          });

        if (messageAuthorProfile) {
          // Récupérer les informations de l'utilisateur auteur du message
          const messageAuthor = await this.userRepository.ofId(message.ownerId);

          if (messageAuthor) {
            await this.notificationGateway.sendMessageDeletedNotification({
              to: messageAuthor.devices.map((device) => ({
                token: device.token,
                language: messageAuthorProfile.nativeLanguage.code,
              })),
              content: instance.content,
              roomTitle: '',
              session: instance.metadata?.session,
            });

            await this.emailGateway.sendMessageDeletedEmail({
              to: messageAuthor.email,
              language: messageAuthorProfile.nativeLanguage.code,
              roomTitle: '',
              content: instance.content,
            });
          }
        }
      }
    }

    return this.reportRepository.updateReport(
      command.id,
      command.status,
      command.comment,
      {
        ...instance.metadata,
        isMessageDeleted:
          command.shouldDeleteMessage || instance.metadata?.isMessageDeleted,
      },
    );
  }
}
