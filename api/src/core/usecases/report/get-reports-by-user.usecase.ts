import { Inject, Injectable } from '@nestjs/common';
import {
  ReportRepository,
  REPORT_REPOSITORY,
} from '../../ports/report.repository';

@Injectable()
export class GetReportsByUserUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(userId: string) {
    return this.reportRepository.findReportsByUser(userId);
  }
}
