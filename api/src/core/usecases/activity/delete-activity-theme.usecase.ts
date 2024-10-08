import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { RessourceIsUsed } from 'src/core/errors/ressource-is-used.exception';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';

@Injectable()
export class DeleteActivityThemeUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(id: string) {
    const activityTheme = await this.activityRepository.ofThemeId(id);
    if (!activityTheme) {
      throw new RessourceDoesNotExist();
    }

    const activities = await this.activityRepository.all({
      themesIds: [id],
    });
    if (activities.items.length > 0) {
      throw new RessourceIsUsed();
    }

    return this.activityRepository.deleteTheme(id);
  }
}
