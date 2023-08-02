import { Inject, Injectable } from '@nestjs/common';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';
import { Report, ReportStatus } from '../../models/report.model';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import {
  DomainErrorCode,
  RessourceAlreadyExists,
  RessourceDoesNotExist,
} from 'src/core/errors';

export class CreateReportCommand {
  id: string;
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
  ) {}

  async execute(command: CreateReportCommand): Promise<Report> {
    const instance = await this.reportRepository.reportOfId(command.id);
    if (instance) {
      throw new RessourceAlreadyExists(`Report already exists`);
    }

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
      Report.create({ ...command, category, status: ReportStatus.OPEN }),
    );
  }
}
