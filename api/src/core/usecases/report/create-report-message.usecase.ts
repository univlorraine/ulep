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

import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { DomainErrorCode, RessourceDoesNotExist } from 'src/core/errors';
import { University, User } from 'src/core/models';
import { EmailGateway, EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';
import {
  UuidProviderInterface,
  UUID_PROVIDER,
} from 'src/core/ports/uuid.provider';
import {
  CONVERSATION_CATEGORY,
  Report,
  ReportStatus,
} from '../../models/report.model';
import {
  ReportRepository,
  REPORT_REPOSITORY,
} from '../../ports/report.repository';
import { UserRepository, USER_REPOSITORY } from '../../ports/user.repository';

export class CreateReportMessageCommand {
  ownerId: string;
  content: string;
  filePath?: string;
  mediaType?: string;
  tandemId?: string;
  messageId?: string;
  reportedUserId: string;
}

@Injectable()
export class CreateReportMessageUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    private readonly keycloakClient: KeycloakClient,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
  ) {}

  async execute(command: CreateReportMessageCommand): Promise<Report> {
    const category = await this.reportRepository.categoryOfName(
      CONVERSATION_CATEGORY,
    );
    if (!category) {
      throw new RessourceDoesNotExist(
        `Category does not exist`,
        DomainErrorCode.BAD_REQUEST,
      );
    }

    const owner = await this.userRepository.ofId(command.ownerId);
    if (!owner) {
      throw new RessourceDoesNotExist(`User does not exist`);
    }

    let reportedAdministrator: UserRepresentation;
    const reportedUser: User = await this.userRepository.ofId(
      command.reportedUserId,
    );
    if (!reportedUser) {
      reportedAdministrator = await this.keycloakClient.getUserById(
        command.reportedUserId,
      );
      if (!reportedAdministrator) {
        throw new RessourceDoesNotExist(`Reported user does not exist`);
      }
    }

    const tandem = await this.tandemRepository.ofId(command.tandemId);

    const report = await this.reportRepository.createReport(
      Report.create({
        id: this.uuidProvider.generate(),
        ...command,
        category,
        status: ReportStatus.OPEN,
        user: owner,
        metadata: {
          filePath: command.filePath,
          mediaType: command.mediaType,
          tandemUserName: `${reportedUser.firstname} ${reportedUser.lastname}`,
          tandemLanguage: tandem?.learningLanguages[0].language.code,
          messageId: command.messageId,
        },
      }),
    );

    await this.sendEmails(
      report,
      reportedUser?.firstname || reportedAdministrator.firstName,
      reportedUser?.lastname || reportedAdministrator.lastName,
      reportedUser?.university,
    );

    return report;
  }

  private async sendEmails(
    report: Report,
    reportedUserFirstname: string,
    reportedUserLastname: string,
    reportedUserUniversity?: University,
  ) {
    if (report.user.university.notificationEmail) {
      await this.emailGateway.sendNewReportMessageEmail({
        to: report.user.university.notificationEmail,
        language: report.user.university.nativeLanguage.code,
        reportType: report.category.name.content,
        user: {
          firstname: report.user.firstname,
          lastname: report.user.lastname,
        },
        reportedUser: {
          firstname: reportedUserFirstname,
          lastname: reportedUserLastname,
        },
      });
    }

    if (
      reportedUserUniversity &&
      reportedUserUniversity.id !== report.user.university.id &&
      reportedUserUniversity.notificationEmail
    ) {
      await this.emailGateway.sendNewReportMessageEmail({
        to: reportedUserUniversity.notificationEmail,
        language: reportedUserUniversity.nativeLanguage.code,
        reportType: report.category.name.content,
        user: {
          firstname: report.user.firstname,
          lastname: report.user.lastname,
        },
        reportedUser: {
          firstname: reportedUserFirstname,
          lastname: reportedUserLastname,
        },
      });
    }
  }
}
