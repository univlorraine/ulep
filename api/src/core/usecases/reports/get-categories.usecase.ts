import { Inject, Injectable } from '@nestjs/common';
import { ReportRepository } from '../../ports/report.repository';
import { REPORT_REPOSITORY } from '../../../providers/providers.module';
import { ReportCategory } from '../../models/report';

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
