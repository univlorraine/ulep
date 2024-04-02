import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import { DomainErrorCode, RessourceDoesNotExist } from 'src/core/errors';
import {
  Availabilites,
  Gender,
  Interest,
  Language,
  LearningObjective,
  MeetingFrequency,
  Profile,
  User,
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
  age?: number;
  availabilities?: Availabilites;
  availabilitiesNote?: string;
  availabilitiesNotePrivacy?: boolean;
  biography?: { [key: string]: string };
  firstname?: string;
  gender?: Gender;
  interests: string[];
  lastname?: string;
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
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
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

    // Update user associated with the profile
    await this.userRepository.update(
      new User({
        ...profile.user,
        ...(command.age && { age: command.age }),
        ...(command.firstname && { firstname: command.firstname }),
        ...(command.gender && { gender: command.gender }),
        ...(command.lastname && { lastname: command.lastname }),
      }),
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
      ...(nativeLanguage && { nativeLanguage: nativeLanguage }),
      ...(masteredLanguages && { masteredLanguages: masteredLanguages }),
      ...(interests && { interests: interests }),
      ...(objectives && { objectives: objectives }),
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
