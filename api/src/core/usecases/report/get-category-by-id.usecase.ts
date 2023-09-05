import { Inject, Injectable } from '@nestjs/common';
import { ReportCategory } from '../../models';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from 'src/core/ports/report.repository';

interface GetReportCategoryByIdCommand {
  id: string;
}

@Injectable()
export class GetReportCategoryByIdUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly repository: ReportRepository,
  ) {}

  async execute(
    command: GetReportCategoryByIdCommand,
  ): Promise<ReportCategory> {
    return this.repository.categoryOfId(command.id);
  }
}
