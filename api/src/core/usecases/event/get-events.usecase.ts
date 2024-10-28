import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LearningLanguage } from 'src/core/models';
import { EventStatus, EventType } from 'src/core/models/event.model';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';

export type GetEventsCommand = {
  userId: string;
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    title?: string;
    types?: EventType[];
    languageCodes?: string[];
  };
};

@Injectable()
export class GetEventsUsecase {
  private readonly logger = new Logger(GetEventsUsecase.name);
  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: GetEventsCommand) {
    const profile = await this.getProfileFromUser(command.userId);
    const allowedLanguages = await this.generateAllowedLanguages(
      profile.learningLanguages,
    );

    return this.eventRepository.findAllForAnUser({
      ...command,
      filters: {
        ...command.filters,
        status: EventStatus.READY,
        universityId: profile.user.university.id,
        allowedLanguages,
        languageCodes: command.filters.languageCodes,
      },
    });
  }

  private async getProfileFromUser(userId: string) {
    const profile = await this.profileRepository.ofUser(userId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  private async generateAllowedLanguages(
    learningLanguages: LearningLanguage[],
  ) {
    let allowedLanguages: string[][] = [];

    for (const learningLanguage of learningLanguages) {
      const tandem = await this.getTandemForLearningLanguage(learningLanguage);
      const firstLanguage = tandem
        ? tandem.learningLanguages[0].language.code
        : learningLanguage.language.code;
      const secondLanguage = tandem
        ? tandem.learningLanguages[1]?.language.code
        : undefined;

      if (
        !allowedLanguages.some((language) => language.includes(firstLanguage))
      ) {
        allowedLanguages.push([firstLanguage]);
      }

      if (
        secondLanguage &&
        !allowedLanguages.some((language) => language.includes(secondLanguage))
      ) {
        allowedLanguages.push([secondLanguage]);
      }

      if (
        firstLanguage &&
        secondLanguage &&
        !allowedLanguages.some(
          (lang) =>
            (lang.length === 2 &&
              lang[0] === firstLanguage &&
              lang[1] === secondLanguage) ||
            (lang[0] === secondLanguage && lang[1] === firstLanguage),
        )
      ) {
        allowedLanguages.push([firstLanguage, secondLanguage]);
      }
    }
    this.logger.log(allowedLanguages);
    return allowedLanguages;
  }

  private getTandemForLearningLanguage(learningLanguage: LearningLanguage) {
    return this.tandemRepository.getTandemForLearningLanguage(
      learningLanguage.id,
    );
  }
}
