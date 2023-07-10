import { Inject, Injectable } from '@nestjs/common';
import { Report } from '../../models/report';
import { ReportRepository } from '../../ports/report.repository';
import { REPORT_REPOSITORY } from 'src/providers/providers.module';

export type GetReportCommand = {
  id: string;
};

@Injectable()
export class GetReportUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: GetReportCommand): Promise<Report> {
    return this.reportRepository.ofId(command.id);
  }
}
