import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import openGraphScraper from 'open-graph-scraper';
import { RessourceDoesNotExist } from 'src/core/errors';
import { ProficiencyLevel } from 'src/core/models';
import {
  Activity,
  ActivityStatus,
  ActivityVocabulary,
} from 'src/core/models/activity.model';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
  UpdateActivityVocabularyProps,
} from 'src/core/ports/activity.repository';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  NOTIFICATION_GATEWAY,
  NotificationGateway,
} from 'src/core/ports/notification.gateway';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import {
  DeleteAudioVocabularyActivityUsecase,
  UploadAudioVocabularyActivityUsecase,
} from 'src/core/usecases/media';

export class UpdateActivityCommand {
  id: string;
  title?: string;
  status?: ActivityStatus;
  description?: string;
  themeId?: string;
  exercises?: { content: string; order: number }[];
  vocabularies?: UpdateActivityVocabularyProps[];
  languageLevel?: ProficiencyLevel;
  languageCode?: string;
  ressourceUrl?: string;
  creditImage?: string;
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

@Injectable()
export class UpdateActivityUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(UploadAudioVocabularyActivityUsecase)
    private readonly uploadAudioVocabularyActivityUsecase: UploadAudioVocabularyActivityUsecase,
    @Inject(DeleteAudioVocabularyActivityUsecase)
    private readonly deleteAudioVocabularyActivityUsecase: DeleteAudioVocabularyActivityUsecase,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly notificationGateway: NotificationGateway,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(command: UpdateActivityCommand) {
    if (command.languageCode) {
      await this.assertLanguageExist(command.languageCode);
    }
    if (command.themeId) {
      await this.assertThemeExist(command.themeId);
    }

    const activity = await this.activityRepository.ofId(command.id);

    if (!activity) {
      throw new RessourceDoesNotExist('Activity does not exist');
    }

    if (activity.status === ActivityStatus.PUBLISHED) {
      throw new ForbiddenException('Activity is already published');
    }

    let openGraphResult: any;
    const url = command.ressourceUrl
      ? command.ressourceUrl.match(URL_REGEX)?.[0]
      : undefined;
    if (url) {
      try {
        const result = await openGraphScraper({ url });
        if (result.result.success) {
          openGraphResult = result.result;
        }
      } catch (err) {
        console.warn('Url not found for open graph', url);
      }
    }

    const updatedActivity = await this.activityRepository.updateActivity({
      id: command.id,
      title: command.title || activity.title,
      status: command.status || activity.status,
      description: command.description || activity.description,
      themeId: command.themeId,
      exercises: command.exercises || activity.activityExercises,
      languageLevel: command.languageLevel || activity.languageLevel,
      languageCode: command.languageCode,
      ressourceUrl: command.ressourceUrl || activity.ressourceUrl,
      creditImage: command.creditImage || activity.creditImage,
      metadata: openGraphResult
        ? {
            openGraph: openGraphResult,
          }
        : activity.metadata,
    });

    // Remove vocabularies that are not in the command
    const vocabulariesToDelete = activity.activityVocabularies.filter(
      (vocabulary) =>
        vocabulary.id &&
        !command.vocabularies?.some((v) => v.id === vocabulary.id),
    );

    for (const vocabulary of vocabulariesToDelete) {
      await this.deleteVocabulary(vocabulary.id);
    }

    const activityVocabularies: ActivityVocabulary[] =
      activity.activityVocabularies;
    if (command.vocabularies) {
      for (const vocabulary of command.vocabularies) {
        activityVocabularies.push(
          await this.handleVocabularyUpdate(updatedActivity.id, vocabulary),
        );
      }
    }

    await this.sendNotifications(updatedActivity, activity);

    for (const vocabulary of activity.activityVocabularies) {
      if (
        vocabulary.pronunciationActivityVocabulary &&
        !vocabulary.pronunciationActivityVocabularyUrl
      ) {
        const audioUrl = await this.storage.temporaryUrl(
          vocabulary.pronunciationActivityVocabulary.bucket,
          vocabulary.pronunciationActivityVocabulary.name,
          3600,
        );
        vocabulary.pronunciationActivityVocabularyUrl = audioUrl;
      }
    }

    updatedActivity.activityVocabularies = activityVocabularies;

    return updatedActivity;
  }

  private async assertLanguageExist(code: string) {
    const language = await this.languageRepository.ofCode(code.toLowerCase());

    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }

  private async assertThemeExist(id: string) {
    const theme = await this.activityRepository.ofThemeId(id);

    if (!theme) {
      throw new RessourceDoesNotExist('Theme does not exist');
    }
  }

  private async handleVocabularyUpdate(
    activityId: string,
    vocabulary: UpdateActivityVocabularyProps,
  ) {
    let newVocabulary: ActivityVocabulary;
    if (vocabulary.id) {
      newVocabulary = await this.updateVocabulary(
        vocabulary.id,
        vocabulary.content,
        vocabulary.pronunciation,
        vocabulary.pronunciationUrl,
      );
    } else {
      newVocabulary = await this.createVocabularyForActivity(
        activityId,
        vocabulary.content,
        vocabulary.pronunciation,
      );
    }
    return newVocabulary;
  }

  private async updateVocabulary(
    vocabularyId: string,
    content: string,
    pronunciation?: Express.Multer.File,
    pronunciationUrl?: string,
  ) {
    const vocabularyToUpdate = await this.activityRepository.ofVocabularyId(
      vocabularyId,
    );

    if (!vocabularyToUpdate) {
      return;
    }

    let newVocabulary: ActivityVocabulary;
    // Update content if it has changed
    if (content !== vocabularyToUpdate.content) {
      newVocabulary = await this.activityRepository.updateVocabulary(
        vocabularyToUpdate.id,
        content,
      );
    } else {
      newVocabulary = vocabularyToUpdate;
    }

    // Delete old pronunciation if needed ( no url )
    if (
      vocabularyToUpdate.pronunciationActivityVocabulary &&
      !pronunciationUrl
    ) {
      await this.deleteAudioVocabularyActivityUsecase.execute({
        vocabularyId: newVocabulary.id,
      });
    }

    // Upload new   pronunciation if it has changed
    if (pronunciation) {
      const audioUrl = await this.uploadAudioVocabularyActivityUsecase.execute({
        vocabularyId: newVocabulary.id,
        file: pronunciation,
      });

      newVocabulary.pronunciationActivityVocabularyUrl = audioUrl;
    }

    return newVocabulary;
  }

  private async createVocabularyForActivity(
    activityId: string,
    content: string,
    pronunciation?: Express.Multer.File,
  ) {
    const vocabulary =
      await this.activityRepository.createVocabularyForActivity(
        activityId,
        content,
      );
    if (pronunciation) {
      const audioUrl = await this.uploadAudioVocabularyActivityUsecase.execute({
        vocabularyId: vocabulary.id,
        file: pronunciation,
      });

      vocabulary.pronunciationActivityVocabularyUrl = audioUrl;
    }

    return vocabulary;
  }

  private async deleteVocabulary(vocabularyId: string) {
    await this.deleteAudioVocabularyActivityUsecase.execute({
      vocabularyId,
    });
    await this.activityRepository.deleteVocabulary(vocabularyId);
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
}
