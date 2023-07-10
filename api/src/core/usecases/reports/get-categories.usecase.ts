import { Inject, Injectable } from '@nestjs/common';
import { ReportRepository } from '../../ports/report.repository';
import { REPORT_REPOSITORY } from 'src/providers/providers.module';
import { ReportCategory } from 'src/core/models/report';

@Injectable()
export class GetReportCategoriesUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(): Promise<ReportCategory[]> {
    return this.reportRepository.categories();
  }
}
