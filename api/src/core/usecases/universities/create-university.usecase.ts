import { Inject, Injectable } from '@nestjs/common';
import { University } from '../../models/university';
import { UniversityRepository } from '../../ports/university.repository';
import {
  LANGUAGE_REPOSITORY,
  UNIVERSITY_REPOSITORY,
} from '../../../providers/providers.module';
import { UniversityAlreadyExists } from '../../errors/RessourceAlreadyExists';
import { LanguageRepository } from 'src/core/ports/language.repository';
import {
  LanguageDoesNotExist,
  UniversityDoesNotExist,
} from 'src/core/errors/RessourceDoesNotExist';

export class CreateUniversityCommand {
  name: string;
  website?: string;
  parent?: string;
  campus: string[];
  timezone: string;
  languageCodes: string[];
  admissionStart: Date;
  admissionEnd: Date;
}

// TODO: Add validation for languages and central (only one university central is authorized)
@Injectable()
export class CreateUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: CreateUniversityCommand): Promise<University> {
    const university = await this.universityRepository.ofName(command.name);
    if (university) {
      throw UniversityAlreadyExists.withNameOf(command.name);
    }

    const languages = await Promise.all(
      command.languageCodes.map((code) =>
        this.tryToFindTheLanguageOfCode(code),
      ),
    );

    if (command.parent) {
      await this.tryToFindTheUniversityOfId(command.parent);
    }

    const instance = University.create({
      name: command.name,
      website: command.website,
      parent: command.parent,
      campus: command.campus,
      timezone: command.timezone,
      languages: languages,
      admissionStart: command.admissionStart,
      admissionEnd: command.admissionEnd,
    });

    await this.universityRepository.create(instance);

    return instance;
  }

  private async tryToFindTheLanguageOfCode(code: string) {
    const language = await this.languageRepository.ofCode(code);
    if (!language) {
      throw LanguageDoesNotExist.withCodeOf(code);
    }

    return language;
  }

  private async tryToFindTheUniversityOfId(id: string) {
    const university = await this.universityRepository.ofId(id);
    if (!university) {
      throw UniversityDoesNotExist.withIdOf(id);
    }

    return university;
  }
}
