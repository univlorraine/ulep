import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import { Report } from '../../models';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from '../../ports/report.repository';

@Injectable()
export class GetReportUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
  ) {}

  async execute(id: string): Promise<Report> {
    const instance = await this.reportRepository.reportOfId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    if (instance && instance.metadata && instance.metadata.filePath) {
      instance.metadata.filePath = await this.storage.temporaryUrl(
        'chat',
        instance.metadata.filePath,
        60 * 60 * 24,
      );
    }

    return instance;
  }
}
