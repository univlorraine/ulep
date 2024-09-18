import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from 'src/core/models';
import { ActivityStatus } from 'src/core/models/activity.model';
import {
  ACTIVITY_REPOSITORY,
  ActivityPagination,
  ActivityRepository,
} from 'src/core/ports/activity.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';

interface GetActivitiesCommand {
  languagesCodes?: string[];
  languageLevels?: string[];
  themesIds?: string[];
  searchTitle?: string;
  status: ActivityStatus[];
  userId?: string;
  pagination: ActivityPagination;
}

@Injectable()
export class GetActivitiesUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: GetActivitiesCommand) {
    let languagesCodes = [];
    if (command.languagesCodes) {
      languagesCodes = await Promise.all(
        command.languagesCodes.map((code) => this.assertLanguageExist(code)),
      );
      languagesCodes = languagesCodes.filter(
        (code) => code !== undefined,
      ) as string[];
    }

    let themesIds = [];
    if (command.themesIds) {
      themesIds = await Promise.all(
        command.themesIds.map((id) => this.assertThemeExist(id)),
      );
      themesIds = themesIds.filter((id) => id !== undefined) as string[];
    }

    let profile: Profile | undefined;
    if (command.userId) {
      profile = await this.getProfileFromUserId(command.userId);
    }

    const activityThemes = await this.activityRepository.all({
      languageLevels: command.languageLevels,
      languagesCodes: languagesCodes.length > 0 ? languagesCodes : undefined,
      status: command.status,
      pagination: command.pagination,
      searchTitle: command.searchTitle,
      themesIds: themesIds.length > 0 ? themesIds : undefined,
      profileId: profile?.id,
    });

    return activityThemes;
  }

  async assertLanguageExist(languageCode: string) {
    const language = await this.languageRepository.ofCode(languageCode);
    if (!language) {
      return undefined;
    }
    return language.code;
  }

  async getProfileFromUserId(userId: string) {
    const profile = await this.profileRepository.ofUser(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async assertThemeExist(themeId: string) {
    const theme = await this.activityRepository.ofThemeId(themeId);
    if (!theme) {
      return undefined;
    }
    return theme.id;
  }
}
