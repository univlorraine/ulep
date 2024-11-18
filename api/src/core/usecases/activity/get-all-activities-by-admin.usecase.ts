import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActivityStatus } from 'src/core/models/activity.model';
import {
  ActivityPagination,
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';

interface GetActivitiesCommand {
  pagination: ActivityPagination;
  userId: string;
  searchTitle?: string;
  languageCode?: string;
  languageLevel?: string;
  category?: string;
  theme?: string;
  status?: ActivityStatus;
  university?: string;
}

@Injectable()
export class GetAllActivitiesByAdminUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(command: GetActivitiesCommand) {
    const user = await this.getUserUniversityId(command.userId);

    const activities = await this.activityRepository.allWithThemeWithCategory({
      searchTitle: command.searchTitle,
      pagination: command.pagination,
      languageCode: command.languageCode,
      languageLevel: command.languageLevel,
      category: command.category,
      theme: command.theme,
      status: command.status
        ? [command.status]
        : [
            ActivityStatus.PUBLISHED,
            ActivityStatus.IN_VALIDATION,
            ActivityStatus.REJECTED,
            ActivityStatus.DRAFT,
          ],
      university: command.university,
      currentUserUniversityId: user.attributes['universityId'][0],
    });

    return activities;
  }

  private async getUserUniversityId(userId: string) {
    const user = await this.keycloakClient.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
