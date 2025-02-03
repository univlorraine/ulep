import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Activity, ActivityStatus } from 'src/core/models/activity.model';
import { LogEntryType } from 'src/core/models/log-entry.model';
import {
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';
import { EmailGateway, EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import {
  NotificationGateway,
  NOTIFICATION_GATEWAY,
} from 'src/core/ports/notification.gateway';
import { CreateOrUpdateLogEntryUsecase } from 'src/core/usecases/log-entry';

export class UpdateActivityStatusCommand {
  id: string;
  status: ActivityStatus;
}

@Injectable()
export class UpdateActivityStatusUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly notificationGateway: NotificationGateway,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(CreateOrUpdateLogEntryUsecase)
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
  ) {}

  async execute(command: UpdateActivityStatusCommand) {
    const activity = await this.activityRepository.ofId(command.id);

    if (!activity) {
      throw new RessourceDoesNotExist('Activity does not exist');
    }

    if (
      command.status === ActivityStatus.PUBLISHED &&
      activity.status === ActivityStatus.PUBLISHED
    ) {
      throw new ForbiddenException('Activity is already published');
    }

    // Create a log entry when an activity is submitted for validation
    if (command.status === ActivityStatus.IN_VALIDATION) {
      const learningLanguage = await this.findActivityLearningLanguageCreator(
        command.id,
      );

      if (learningLanguage) {
        await this.createOrUpdateLogEntryUsecase.execute({
          learningLanguageId: learningLanguage.id,
          type: LogEntryType.SUBMIT_ACTIVITY,
          metadata: {
            activityId: activity.id,
            activityTitle: activity.title,
          },
        });
      }
    }

    const updatedActivity = await this.activityRepository.updateActivityStatus(
      command.id,
      command.status,
    );

    if (updatedActivity.creator) {
      await this.sendNotifications(updatedActivity, activity);
    }

    return updatedActivity;
  }

  private async sendNotifications(activity: Activity, oldActivity: Activity) {
    if (activity.status === oldActivity.status) {
      return;
    }

    const devices = activity.creator.user.devices.map((device) => ({
      token: device.token,
      language: activity.creator.nativeLanguage.code,
    }));

    const pushAuthorized = activity.creator.user.acceptsEmail;
    const firstname = activity.creator.user.firstname;
    const lastname = activity.creator.user.lastname;
    const nativeLanguage = activity.creator.nativeLanguage.code;

    if (
      activity.status === ActivityStatus.PUBLISHED &&
      oldActivity.status !== ActivityStatus.PUBLISHED &&
      pushAuthorized
    ) {
      await this.notificationGateway.sendActivityPublishedNotification({
        to: devices,
        activity: { title: activity.title },
      });
      await this.emailGateway.sendActivityPublishedEmail({
        to: activity.creator.user.email,
        language: nativeLanguage,
        user: { firstname, lastname },
        activity: { title: activity.title },
      });
    } else if (
      activity.status === ActivityStatus.REJECTED &&
      oldActivity.status !== ActivityStatus.REJECTED &&
      pushAuthorized
    ) {
      await this.notificationGateway.sendActivityRejectedNotification({
        to: devices,
        activity: { title: activity.title },
      });
      await this.emailGateway.sendActivityRejectedEmail({
        to: activity.creator.user.email,
        language: nativeLanguage,
        user: { firstname, lastname },
        activity: { title: activity.title },
      });
    }

    if (
      activity.status === ActivityStatus.IN_VALIDATION &&
      oldActivity.status !== ActivityStatus.IN_VALIDATION &&
      activity.creator.user.university.notificationEmail
    ) {
      await this.emailGateway.sendNewActivityProposalEmail({
        to: activity.creator.user.university.notificationEmail,
        language: activity.creator.user.university.nativeLanguage.code,
        user: {
          firstname,
          lastname,
        },
        activity: { title: activity.title },
      });
    }
  }

  private async findActivityLearningLanguageCreator(activityId: string) {
    const activity = await this.activityRepository.ofId(activityId);
    if (!activity) {
      throw new RessourceDoesNotExist('Activity does not exist');
    }

    return activity.creator?.findLearningLanguageByCode(activity.language.code);
  }
}
