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
