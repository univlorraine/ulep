import { Inject, Injectable } from '@nestjs/common';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';
import { Report, ReportStatus } from '../../models/report.model';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import { RessourceAlreadyExists, RessourceDoesNotExist } from 'src/core/errors';

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
      throw new RessourceAlreadyExists();
    }

    const category = await this.reportRepository.categoryOfId(command.category);
    if (!category) {
      throw new RessourceDoesNotExist();
    }

    const owner = await this.userRepository.ofId(command.owner);
    if (!owner) {
      throw new RessourceDoesNotExist();
    }

    return this.reportRepository.createReport(
      Report.create({ ...command, category, status: ReportStatus.OPEN }),
    );
  }
}
