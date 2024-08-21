import { Inject, Injectable } from '@nestjs/common';
import { DomainErrorCode, RessourceDoesNotExist } from 'src/core/errors';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';
import { Report, ReportStatus } from '../../models/report.model';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';

export class CreateReportCommand {
  owner: string;
  category: string;
  content: string;
}

@Injectable()
export class CreateReportUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateReportCommand): Promise<Report> {
    const category = await this.reportRepository.categoryOfId(command.category);
    if (!category) {
      throw new RessourceDoesNotExist(
        `Category does not exist`,
        DomainErrorCode.BAD_REQUEST,
      );
    }

    const owner = await this.userRepository.ofId(command.owner);
    if (!owner) {
      throw new RessourceDoesNotExist(`User does not exist`);
    }

    return this.reportRepository.createReport(
      Report.create({
        id: this.uuidProvider.generate(),
        ...command,
        category,
        status: ReportStatus.OPEN,
        user: owner,
      }),
    );
  }
}
