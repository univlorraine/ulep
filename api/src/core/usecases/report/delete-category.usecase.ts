import { Inject, Injectable } from '@nestjs/common';
import {
  DomainError,
  DomainErrorCode,
  RessourceDoesNotExist,
} from 'src/core/errors';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from 'src/core/ports/report.repository';

export class DeleteCategoryCommand {
  id: string;
}

@Injectable()
export class DeleteReportCategoryUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const instance = await this.reportRepository.categoryOfId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    const hasActiveReport = await this.reportRepository.hasActiveReport(
      command.id,
    );

    if (hasActiveReport) {
      throw new DomainError({
        code: DomainErrorCode.BAD_REQUEST,
        message: 'You cannot delete category with active report',
      });
    }

    return this.reportRepository.deleteCategory(instance);
  }
}
