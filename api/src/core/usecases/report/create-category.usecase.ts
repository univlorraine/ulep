import { Inject, Injectable } from '@nestjs/common';
import { ReportCategory, Translation } from '../../models';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from '../../ports/uuid.provider';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from 'src/core/ports/report.repository';
import {
  DomainErrorCode,
  RessourceAlreadyExists,
  RessourceDoesNotExist,
} from 'src/core/errors';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';

export class CreateReportCategoryCommand {
  name: string;
  languageCode: string;
  translations?: Translation[];
}

@Injectable()
export class CreateReportCategoryUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly repository: ReportRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateReportCategoryCommand): Promise<ReportCategory> {
    const instance = await this.repository.categoryOfName(command.name);
    if (instance) {
      throw new RessourceAlreadyExists('Category already exists');
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist(
        'Language does not exist',
        DomainErrorCode.BAD_REQUEST,
      );
    }

    return this.repository.createCategory({
      id: this.uuidProvider.generate(),
      name: {
        id: this.uuidProvider.generate(),
        content: command.name,
        language: command.languageCode,
        translations: command.translations,
      },
    });
  }
}
