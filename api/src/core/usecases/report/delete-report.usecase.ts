import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';

export class DeleteReportCommand {
  id: string;
}

@Injectable()
export class DeleteReportUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: DeleteReportCommand): Promise<void> {
    const instance = await this.reportRepository.reportOfId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return this.reportRepository.deleteReport({
      id: instance.id,
    });
  }
}
