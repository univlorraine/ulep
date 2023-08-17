import { Inject, Injectable } from '@nestjs/common';
import { Report } from '../../models/report.model';
import {
  REPORT_REPOSITORY,
  ReportQueryOrderBy,
  ReportQueryWhere,
  ReportRepository,
} from '../../ports/report.repository';
import { Collection } from '@app/common';

export class GetReportsCommand {
  limit?: number;
  orderBy?: ReportQueryOrderBy;
  page?: number;
  where?: ReportQueryWhere;
}
@Injectable()
export class GetReportsByStatusUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: GetReportsCommand): Promise<Collection<Report>> {
    const { page = 1, limit = 30, orderBy, where } = command;
    const offset = (page - 1) * limit;

    return this.reportRepository.all(offset, limit, orderBy, where);
  }
}
