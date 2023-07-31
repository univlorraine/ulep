import { Inject, Injectable } from '@nestjs/common';
import { Report, ReportStatus } from '../../models/report.model';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';

@Injectable()
export class GetReportsByStatusUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(status: ReportStatus): Promise<Report[]> {
    return this.reportRepository.reportsByStatus(status);
  }
}
