import { Collection } from '../../../shared/types/collection';
import { Report } from '../../models/report';
import { ReportRepository } from '../../ports/report.repository';
import { StringFilter } from '../../../shared/types/filters';
import { Inject, Injectable } from '@nestjs/common';
import { REPORT_REPOSITORY } from '../../../providers/providers.module';

export type GetReportsCommand = {
  page: number;
  limit: number;
  category?: { name: StringFilter };
};

@Injectable()
export class GetReportsUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: GetReportsCommand): Promise<Collection<Report>> {
    const { page, limit } = command;
    const offset = (page - 1) * limit;

    return this.reportRepository.where(offset, limit, command.category);
  }
}
