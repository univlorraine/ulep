import { Inject, Injectable } from '@nestjs/common';
import { DomainErrorCode, RessourceDoesNotExist } from 'src/core/errors';
import {
  Availabilites,
  Interest,
  Language,
  LearningObjective,
  MeetingFrequency,
  Profile,
} from 'src/core/models';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from 'src/core/ports/interest.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  LearningObjectiveRepository,
  OBJECTIVE_REPOSITORY,
} from 'src/core/ports/objective.repository';

export class UpdateUserCommand {
  availabilities?: Availabilites;
  availabilitiesNote?: string;
  availabilitiesNotePrivacy?: boolean;
  biography?: { [key: string]: string };
  interests: string[];
  masteredLanguageCodes?: string[];
  meetingFrequency: MeetingFrequency;
  nativeLanguageCode: string;
  objectives: string[];
}

@Injectable()
export class UpdateProfileUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly interestsRepository: InterestRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(id: string, command: UpdateUserCommand): Promise<Profile> {
    const profile = await this.profileRepository.ofId(id);

    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    const interests = await Promise.all(
      command.interests.map((id) => this.tryToFindTheInterestOfId(id)),
    );

    const nativeLanguage = await this.tryToFindTheLanguageOfCode(
      command.nativeLanguageCode,
    );

    const masteredLanguages = await Promise.all(
      (command.masteredLanguageCodes ?? []).map((code) =>
        this.tryToFindTheLanguageOfCode(code),
      ),
    );

    const objectives = await Promise.all(
      command.objectives.map((id) => this.tryToFindTheObjectiveOfId(id)),
    );

    const newProfile = new Profile({
      ...profile,
      ...(command.availabilities && { availabilities: command.availabilities }),
      ...(command.availabilitiesNote && {
        availabilitiesNote: command.availabilitiesNote,
      }),
      ...(command.availabilitiesNotePrivacy && {
        availabilitiesNotePrivacy: command.availabilitiesNotePrivacy,
      }),
      ...(command.biography && { biography: command.biography }),
      ...(command.meetingFrequency && {
        meetingFrequency: command.meetingFrequency,
      }),
      ...(nativeLanguage && { nativeLanguage }),
      ...(masteredLanguages && { masteredLanguages }),
      ...(interests && { interests }),
      ...(objectives && { objectives }),
    });

    const updatedProfile = await this.profileRepository.update(newProfile);

    return updatedProfile;
  }

  private async tryToFindTheInterestOfId(id: string): Promise<Interest> {
    const interest = await this.interestsRepository.interestOfId(id);
    if (!interest) {
      throw new RessourceDoesNotExist('Interest does not exist');
    }

    return interest;
  }

  private async tryToFindTheLanguageOfCode(code: string): Promise<Language> {
    const language = await this.languageRepository.ofCode(code.toLowerCase());
    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }

  private async tryToFindTheObjectiveOfId(
    id: string,
  ): Promise<LearningObjective> {
    const objective = await this.objectiveRepository.ofId(id);
    if (!objective) {
      throw new RessourceDoesNotExist(
        'The objective does not exist',
        DomainErrorCode.BAD_REQUEST,
      );
    }

    return objective;
  }
}
