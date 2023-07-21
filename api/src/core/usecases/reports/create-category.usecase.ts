import { RessourceAlreadyExists } from '../../errors/RessourceAlreadyExists';
import { ReportRepository } from '../../ports/report.repository';
import { Inject, Injectable } from '@nestjs/common';
import { REPORT_REPOSITORY } from '../../../providers/providers.module';

export type CreateReportCategoryCommand = {
  name: string;
};

@Injectable()
export class CreateReportCategoryUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: CreateReportCategoryCommand): Promise<string> {
    await this.assertCategoryDoesNotExistForName(command.name);

    return this.reportRepository.createCategory(command.name);
  }

  private async assertCategoryDoesNotExistForName(name: string): Promise<void> {
    const exists = await this.reportRepository.categoryOfName(name);

    if (exists) {
      throw new RessourceAlreadyExists('ReportCategory', 'name', name);
    }

    return Promise.resolve();
  }
}
