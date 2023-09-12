import { Inject, Injectable } from '@nestjs/common';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';
import { Report } from '../../models';
import { RessourceDoesNotExist } from 'src/core/errors';

@Injectable()
export class GetReportUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(id: string): Promise<Report> {
    const instance = await this.reportRepository.reportOfId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return instance;
  }
}
