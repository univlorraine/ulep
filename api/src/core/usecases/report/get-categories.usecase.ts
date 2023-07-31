import { Inject, Injectable } from '@nestjs/common';
import { ReportCategory } from '../../models';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from 'src/core/ports/report.repository';

@Injectable()
export class GetCategoriesUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly repository: ReportRepository,
  ) {}

  async execute(): Promise<ReportCategory[]> {
    return this.repository.categories();
  }
}
