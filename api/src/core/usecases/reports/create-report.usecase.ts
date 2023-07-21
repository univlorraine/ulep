import { Inject, Injectable } from '@nestjs/common';
import { ReportRepository } from '../../ports/report.repository';
import { Report, ReportCategory } from '../../models/report';
import { RessourceDoesNotExist } from '../../errors/RessourceDoesNotExist';
import {
  REPORT_REPOSITORY,
  USER_REPOSITORY,
} from '../../../providers/providers.module';
import { UserRepository } from '../../ports/user.repository';
import { User } from '../../models/user';

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
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateReportCommand): Promise<void> {
    const category = await this.tryToFindTheCategoryOfId(command.category);
    const user = await this.tryToFindTheUserOfId(command.userId);

    const report = Report.create({
      id: command.id,
      content: command.content,
      category: category,
      owner: user,
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

  private async tryToFindTheUserOfId(id: string): Promise<User> {
    const user = await this.userRepository.ofId(id);

    if (!user) {
      throw new RessourceDoesNotExist('User', 'id', id);
    }

    return user;
  }
}
