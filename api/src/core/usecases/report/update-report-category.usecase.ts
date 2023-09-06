import { Inject, Injectable } from '@nestjs/common';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';
import { ReportCategory, Translation } from '../../models';
import { RessourceDoesNotExist } from 'src/core/errors';

export class UpdateReportCategoryCommand {
  id: string;
  name: string;
  translations?: Translation[];
}

@Injectable()
export class UpdateReportCategoryUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: UpdateReportCategoryCommand) {
    const category = await this.reportRepository.categoryOfId(command.id);

    if (!category) {
      throw new RessourceDoesNotExist();
    }

    return this.reportRepository.updateCategoryReport(
      new ReportCategory({
        id: category.id,
        name: {
          id: category.name.id,
          content: command.name,
          language: category.name.language,
          translations: command.translations,
        },
      }),
    );
  }
}
