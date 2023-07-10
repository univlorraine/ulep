import { ReportRepository } from '../../ports/report.repository';
import { RessourceDoesNotExist } from '../../errors/RessourceDoesNotExist';
import { Inject, Injectable } from '@nestjs/common';
import { REPORT_REPOSITORY } from 'src/providers/providers.module';

export type DeleteReportCommand = {
  id: string;
};

@Injectable()
export class DeleteReportUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: DeleteReportCommand): Promise<void> {
    await this.assertReportExistForId(command.id);

    await this.reportRepository.delete(command.id);
  }

  private async assertReportExistForId(id: string): Promise<void> {
    const report = await this.reportRepository.ofId(id);

    if (!report) {
      throw new RessourceDoesNotExist('Report', 'id', id);
    }

    return Promise.resolve();
  }
}
