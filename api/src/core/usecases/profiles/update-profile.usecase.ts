import { Inject, Injectable } from '@nestjs/common';
import {
  ProfileDoesNotExist,
  UniversityDoesNotExist,
} from '../../errors/RessourceDoesNotExist';
import { Goal, MeetingFrequency, Profile } from '../../models/profile';
import { University } from '../../models/university';
import { ProfileRepository } from '../../ports/profile.repository';
import { UniversityRepository } from '../../ports/university.repository';
import {
  PROFILE_REPOSITORY,
  UNIVERSITY_REPOSITORY,
} from '../../../providers/providers.module';

export type UpdateProfileCommand = {
  id: string;
  university?: string;
  goals?: Goal[];
  meetingFrequency?: MeetingFrequency;
  bios?: string;
};

@Injectable()
export class UpdateProfileUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<Profile> {
    const profile = await this.tryToFindTheProfilerOfId(command.id);

    if (command.university) {
      profile.university = await this.tryToFindTheUniversityOfId(
        command.university,
      );
    }

    if (command.goals) {
      profile.goals = command.goals;
    }

    if (command.meetingFrequency) {
      profile.meetingFrequency = command.meetingFrequency;
    }

    if (command.bios) {
      profile.bios = command.bios;
    }

    await this.profileRepository.save(profile);

    return profile;
  }

  private async tryToFindTheProfilerOfId(id: string): Promise<Profile> {
    const instance = await this.profileRepository.ofId(id);
    if (!instance) {
      throw ProfileDoesNotExist.withIdOf(id);
    }
    return instance;
  }

  private async tryToFindTheUniversityOfId(id: string): Promise<University> {
    const instance = await this.universityRepository.ofId(id);
    if (!instance) {
      throw UniversityDoesNotExist.withIdOf(id);
    }
    return instance;
  }
}
