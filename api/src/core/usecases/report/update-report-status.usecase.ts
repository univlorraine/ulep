import { Inject, Injectable } from '@nestjs/common';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';
import { ReportStatus } from '../../models';
import { RessourceDoesNotExist } from 'src/core/errors';

export class UpdateReportStatusCommand {
  id: string;
  status: ReportStatus;
  comment?: string;
}

@Injectable()
export class UpdateReportStatusUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: UpdateReportStatusCommand) {
    const instance = await this.reportRepository.reportOfId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return this.reportRepository.updateReport(
      command.id,
      command.status,
      command.comment,
    );
  }
}
