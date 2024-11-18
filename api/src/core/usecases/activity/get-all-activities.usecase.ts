import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ActivityPagination,
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from 'src/core/ports/storage.interface';

interface GetActivitiesCommand {
  languagesCodes?: string[];
  languageLevels?: string[];
  themesIds?: string[];
  searchTitle?: string;
  userId?: string;
  pagination: ActivityPagination;
  shouldOnlyTakeMine?: boolean;
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
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
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

    const profile = await this.assertProfileExist(command.userId);

    const activities = await this.activityRepository.all({
      languageLevels: command.languageLevels,
      languagesCodes: languagesCodes.length > 0 ? languagesCodes : undefined,
      pagination: command.pagination,
      searchTitle: command.searchTitle,
      themesIds: themesIds.length > 0 ? themesIds : undefined,
      profileId: profile.id,
      shouldOnlyTakeMine: command.shouldOnlyTakeMine,
    });

    for (const activity of activities.items) {
      if (activity.image) {
        const imageUrl = await this.storage.temporaryUrl(
          activity.image.bucket,
          activity.image.name,
          3600,
        );
        activity.imageUrl = imageUrl;
      }
    }

    return activities;
  }

  async assertLanguageExist(languageCode: string) {
    const language = await this.languageRepository.ofCode(languageCode);
    if (!language) {
      return undefined;
    }
    return language.code;
  }

  async assertProfileExist(userId: string) {
    console.log('userId', userId);
    const profile = await this.profileRepository.ofUser(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
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
