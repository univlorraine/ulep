import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguage, ProficiencyLevel, Profile } from 'src/core/models';
import { TestedLanguage } from 'src/core/models/tested-language.model';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TESTED_LANGUAGE_REPOSITORY,
  TestedLanguageRepository,
} from 'src/core/ports/tested-language.repository';

export interface CreateOrUpdateTestedLanguageCommand {
  profileId: string;
  code: string;
  level: ProficiencyLevel;
}

@Injectable()
export class CreateOrUpdateTestedLanguageUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(TESTED_LANGUAGE_REPOSITORY)
    private readonly testedLanguageRepository: TestedLanguageRepository,
  ) {}

  async execute(
    command: CreateOrUpdateTestedLanguageCommand,
  ): Promise<Profile> {
    const profile = await this.profilesRepository.ofId(command.profileId);
    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }

    const language = await this.languageRepository.ofCode(command.code);
    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    const learningLanguage = profile.learningLanguages.find(
      (learningLanguage) => learningLanguage.language.code === command.code,
    );
    const testedLanguage = profile.testedLanguages.find(
      (testedLanguage) => testedLanguage.language.code === command.code,
    );
    if (learningLanguage) {
      await this.learningLanguageRepository.update(
        new LearningLanguage({
          ...learningLanguage,
          level: command.level,
        }),
      );
    } else if (testedLanguage) {
      await this.testedLanguageRepository.update(profile.id, {
        ...testedLanguage,
        level: command.level,
      });
    } else {
      await this.testedLanguageRepository.create(
        profile.id,
        new TestedLanguage({
          language,
          level: command.level,
        }),
      );
    }
    const updatedProfile = await this.profilesRepository.ofId(profile.id);

    return updatedProfile;
  }
}
