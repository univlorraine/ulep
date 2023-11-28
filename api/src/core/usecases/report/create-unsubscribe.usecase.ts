import { Inject, Injectable } from '@nestjs/common';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';
import {
  Report,
  ReportCategory,
  ReportStatus,
  UNSUBSCRIBE_CATEGORY_REPORT,
} from '../../models/report.model';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';
import { configuration } from 'src/configuration';

export class CreateUnsubscribeReportCommand {
  owner: string;
}

@Injectable()
export class CreateUnsubscribeReportUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateUnsubscribeReportCommand): Promise<Report> {
    let category = await this.reportRepository.categoryOfName(
      UNSUBSCRIBE_CATEGORY_REPORT,
    );
    if (!category) {
      category = await this.reportRepository.createCategory(
        new ReportCategory({
          id: this.uuidProvider.generate(),
          name: {
            id: this.uuidProvider.generate(),
            content: UNSUBSCRIBE_CATEGORY_REPORT,
            language: configuration().defaultTranslationLanguage,
            translations: [],
          },
        }),
      );
    }

    const owner = await this.userRepository.ofId(command.owner);
    if (!owner) {
      throw new RessourceDoesNotExist(`User does not exist`);
    }

    // Check if report deletion already exist
    const reportAlreadyExist =
      await this.reportRepository.findReportByUserIdAndCategory(
        owner.id,
        category.id,
      );

    if (reportAlreadyExist) {
      return reportAlreadyExist;
    }

    return this.reportRepository.createReport(
      new Report({
        id: this.uuidProvider.generate(),
        content: '',
        category,
        status: ReportStatus.OPEN,
        user: owner,
      }),
    );
  }
}
