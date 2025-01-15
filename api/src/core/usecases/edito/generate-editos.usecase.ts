import { Inject, Injectable } from '@nestjs/common';
import {
  EditoRepository,
  EDITO_REPOSITORY,
} from 'src/core/ports/edito.repository';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from 'src/core/ports/university.repository';

@Injectable()
export class GenerateEditosUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(EDITO_REPOSITORY)
    private readonly editoRepository: EditoRepository,
  ) {}

  async execute() {
    const universities = await this.universityRepository.findAll();

    const editos = await this.editoRepository.findAll();

    const centralUniversity = universities.items.find(
      (university) => university.parent === null,
    );

    const newEditos = universities.items.map((university) => {
      const translationsLanguageCodes = [];
      if (
        university.nativeLanguage.code !== centralUniversity.nativeLanguage.code
      ) {
        translationsLanguageCodes.push(university.nativeLanguage.code);
      }
      if (
        university.nativeLanguage.code !== 'en' &&
        centralUniversity.nativeLanguage.code !== 'en'
      ) {
        translationsLanguageCodes.push('en');
      }

      return this.editoRepository.create({
        universityId: university.id,
        defaultLanguageCode: centralUniversity.nativeLanguage.code,
        translationsLanguageCodes: translationsLanguageCodes,
      });
    });

    await Promise.all(newEditos);
  }
}
