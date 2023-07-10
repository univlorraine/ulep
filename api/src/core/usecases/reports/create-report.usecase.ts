import { ReportRepository } from '../../ports/report.repository';
import { Report, ReportCategory } from '../../models/report';
import { RessourceDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';
import { Inject, Injectable } from '@nestjs/common';
import { REPORT_REPOSITORY } from 'src/providers/providers.module';

export type CreateReportCommand = {
  id: string;
  content: string;
  category: string;
  userId: string;
};

@Injectable()
export class CreateReportUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(command: CreateReportCommand): Promise<void> {
    const category = await this.tryToFindTheCategoryOfId(command.category);

    const report = Report.create({
      id: command.id,
      content: command.content,
      category: category,
      ownerId: command.userId,
    });

    await this.reportRepository.save(report);
  }

  private async tryToFindTheCategoryOfId(id: string): Promise<ReportCategory> {
    const category = await this.reportRepository.categoryOfId(id);

    if (!category) {
      throw new RessourceDoesNotExist('ReportCategory', 'id', id);
    }

    return category;
  }
}
