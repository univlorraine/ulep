import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';

@Injectable()
export class GetActivityThemeCategoryUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(id: string) {
    const activityThemeCategory =
      await this.activityRepository.ofCategoryThemeId(id);

    if (!activityThemeCategory) {
      throw new RessourceDoesNotExist();
    }

    return activityThemeCategory;
  }
}
