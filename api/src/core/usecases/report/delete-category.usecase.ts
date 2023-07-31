import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
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
    private readonly repository: ReportRepository,
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const instance = await this.repository.categoryOfId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return this.repository.deleteCategory(instance);
  }
}
