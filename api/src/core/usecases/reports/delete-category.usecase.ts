import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from '../../errors/RessourceDoesNotExist';
import { ReportRepository } from '../../ports/report.repository';
import { REPORT_REPOSITORY } from 'src/providers/providers.module';

export type DeleteReportCategoryCommand = {
  id: string;
};

@Injectable()
export class DeleteReportCategoryUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: DeleteReportCategoryCommand): Promise<void> {
    await this.assertCategoryExistForId(command.id);

    await this.reportRepository.deleteCategory(command.id);
  }

  private async assertCategoryExistForId(id: string): Promise<void> {
    const exists = await this.reportRepository.categoryOfId(id);

    if (!exists) {
      throw new RessourceDoesNotExist('ReportCategory', 'id', id);
    }

    return Promise.resolve();
  }
}
