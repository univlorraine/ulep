import { Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import { KeycloakClient } from '@app/keycloak';
import { University } from 'src/core/models';

export class DeleteUniversityCommand {
  id: string;
}

@Injectable()
export class DeleteUniversityUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(command: DeleteUniversityCommand) {
    const instance = await this.universityRepository.ofId(command.id);

    this.assertUniversityExists(instance);
    this.assertIsNotRootUniversity(instance);
    this.assertNoDependentLearningLanguages(instance);
    this.assertNoDependentAdministrators(instance);
    this.assertNoPartners(instance);

    return this.universityRepository.remove(command.id);
  }

  private assertUniversityExists(university: University): void {
    if (!university) {
      throw new RessourceDoesNotExist();
    }
  }

  private assertIsNotRootUniversity(university: University): void {
    if (!university.parent) {
      throw new DomainError({ message: 'Cannot delete root university' });
    }
  }

  private async assertNoDependentLearningLanguages(
    university: University,
  ): Promise<void> {
    const countLearningLanguages =
      await this.learningLanguageRepository.countLanguagesByUniversity(
        university.id,
      );

    if (countLearningLanguages > 0) {
      throw new DomainError({
        message: 'Some learning languages depends on this university',
      });
    }
  }

  private async assertNoDependentAdministrators(
    university: University,
  ): Promise<void> {
    const countAdmins = await this.keycloakClient.getAdministrators(
      university.id,
    );

    if (countAdmins.length > 0) {
      throw new DomainError({
        message: 'Some administrators depends on this university',
      });
    }
  }

  private async assertNoPartners(university: University): Promise<void> {
    const havePartners = await this.universityRepository.havePartners(
      university.id,
    );

    if (havePartners) {
      throw new DomainError({
        message: 'Cannot delete university with partners',
      });
    }
  }
}
