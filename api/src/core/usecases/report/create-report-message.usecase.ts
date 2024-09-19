import { Inject, Injectable } from '@nestjs/common';
import { DomainErrorCode, RessourceDoesNotExist } from 'src/core/errors';
import { User } from 'src/core/models';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';
import {
  CONVERSATION_CATEGORY,
  Report,
  ReportStatus,
} from '../../models/report.model';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';

export class CreateReportMessageCommand {
  ownerId: string;
  content: string;
  filePath?: string;
  mediaType?: string;
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

    const reportedUser = await this.userRepository.ofId(command.reportedUserId);
    if (!reportedUser) {
      throw new RessourceDoesNotExist(`Reported user does not exist`);
    }

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
        },
      }),
    );

    await this.sendEmails(report, reportedUser);

    return report;
  }

  private async sendEmails(report: Report, reportedUser: User) {
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
          firstname: reportedUser.firstname,
          lastname: reportedUser.lastname,
        },
      });
    }

    if (
      reportedUser.university.id !== report.user.university.id &&
      reportedUser.university.notificationEmail
    ) {
      await this.emailGateway.sendNewReportMessageEmail({
        to: reportedUser.university.notificationEmail,
        language: reportedUser.university.nativeLanguage.code,
        reportType: report.category.name.content,
        user: {
          firstname: report.user.firstname,
          lastname: report.user.lastname,
        },
        reportedUser: {
          firstname: reportedUser.firstname,
          lastname: reportedUser.lastname,
        },
      });
    }
  }
}
