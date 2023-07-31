import { Inject, Injectable } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { University } from 'src/core/models';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

export class DeleteLanguageCommand {
  id: string;
  university: string;
}

@Injectable()
export class DeleteLanguageUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly repository: UniversityRepository,
  ) {}

  async execute(command: DeleteLanguageCommand) {
    const university = await this.tryToFindTheUniversityOfId(
      command.university,
    );

    const language = university.languages.find(
      (language) => language.id === command.id,
    );

    if (!language) {
      throw new RessourceDoesNotExist();
    }

    if (university.parent) {
      const parent = await this.tryToFindTheUniversityOfId(university.parent);
      const inheritedLanguage = parent.languages.find(
        (el) => el.code === language.code,
      );
      if (inheritedLanguage) {
        throw new DomainError({ message: 'Cannot delete inherited language' });
      }
    }

    return this.repository.removeLanguage(language, university);
  }

  private async tryToFindTheUniversityOfId(id: string): Promise<University> {
    const university = await this.repository.ofId(id);

    if (!university) {
      throw new RessourceDoesNotExist();
    }

    return university;
  }
}
