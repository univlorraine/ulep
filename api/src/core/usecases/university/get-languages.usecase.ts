import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

export class GetLanguagesCommand {
  university: string;
}

@Injectable()
export class GetLanguagesUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly repository: UniversityRepository,
  ) {}

  async execute(command: GetLanguagesCommand) {
    const university = await this.repository.ofId(command.university);

    if (!university) {
      throw new RessourceDoesNotExist();
    }

    return university.languages;
  }
}
