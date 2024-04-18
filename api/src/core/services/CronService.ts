import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  INSTANCE_REPOSITORY,
  InstanceRepository,
} from 'src/core/ports/instance.repository';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  NOTIFICATION_GATEWAY,
  NotificationGateway,
} from 'src/core/ports/notification.gateway';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

@Injectable()
export class CronService {
  constructor(
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(INSTANCE_REPOSITORY)
    private readonly instanceRepository: InstanceRepository,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly notificationGateway: NotificationGateway,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  @Cron('0 0 * * *')
  async processDailyNotifications() {
    const today = new Date();
    const universities = await this.universityRepository.findAll();
    const instance = await this.instanceRepository.getInstance();

    universities.items.forEach(async (university) => {
      const deviceToNotify: { token: string; language: string }[] = [];
      const universityCloseDate = new Date(university.closeServiceDate);
      universityCloseDate.setDate(
        universityCloseDate.getDate() - instance.daysBeforeClosureNotification,
      );

      if (today >= universityCloseDate) {
        const activeLearningLanguagesToNotify =
          await this.learningLanguageRepository.OfUniversities({
            universityIds: [university.id],
            hasActiveTandem: true,
          });
        activeLearningLanguagesToNotify.items.map(
          (activeLearningLanguageToNotify) => {
            const profile = activeLearningLanguageToNotify.profile;

            this.emailGateway.sendTandemClosureNoticeEmail({
              to: profile.user.email,
              language: profile.nativeLanguage.code,
              user: {
                firstname: profile.user.firstname,
                lastname: profile.user.lastname,
              },
              university: {
                name: university.name,
                closeDate: university.closeServiceDate,
              },
            });

            if (profile.user.devices) {
              profile.user.devices.forEach((device) => {
                deviceToNotify.push({
                  token: device.token,
                  language: profile.nativeLanguage.code,
                });
              });
            }
          },
        );
      }

      await this.notificationGateway.sendTandemClosureNoticeNotification({
        to: deviceToNotify,
        university: {
          name: university.name,
          closeDate: university.closeServiceDate,
        },
      });
    });
  }
}
