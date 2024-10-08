import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { formatInTimeZone } from 'date-fns-tz';
import { EmailGateway, EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import {
  InstanceRepository,
  INSTANCE_REPOSITORY,
} from 'src/core/ports/instance.repository';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  NotificationGateway,
  NOTIFICATION_GATEWAY,
} from 'src/core/ports/notification.gateway';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from 'src/core/ports/university.repository';
import { Profile, Session, Tandem } from '../models';
import {
  SessionRepository,
  SESSION_REPOSITORY,
} from '../ports/session.repository';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from '../ports/tandem.repository';

@Injectable()
export class CronService {
  #logger = new Logger(CronService.name);
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
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
  ) {}

  @Cron('0 14 * * *') // Every day at 14h
  async processDailyNotifications() {
    this.#logger.log('processDailyNotifications');
    const today = new Date(Date.now());
    const universities = await this.universityRepository.findAll();
    const instance = await this.instanceRepository.getInstance();

    universities.items.forEach(async (university) => {
      const deviceToNotify: { token: string; language: string }[] = [];
      // Get initial date to send notification
      const universityCloseDate = new Date(university.closeServiceDate);
      universityCloseDate.setHours(0, 0, 0, 0); // Normalize to midnight
      universityCloseDate.setDate(
        universityCloseDate.getDate() - instance.daysBeforeClosureNotification,
      );

      // Send notification every week
      const daysSinceNotificationStart = Math.floor(
        (today.getTime() - universityCloseDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      // Check if today is the day to send notifications ( every week, after the initial date and before the close date )
      if (
        today >= universityCloseDate &&
        today <= university.closeServiceDate &&
        daysSinceNotificationStart % 7 === 0
      ) {
        const activeLearningLanguagesToNotify =
          await this.learningLanguageRepository.OfUniversities({
            universityIds: [university.id],
            hasActiveTandem: true,
          });

        activeLearningLanguagesToNotify.items.map(
          (activeLearningLanguageToNotify) => {
            const profile = activeLearningLanguageToNotify.profile;

            if (!profile.user.acceptsEmail) {
              return;
            }

            this.emailGateway.sendTandemClosureNoticeEmail({
              to: profile.user.email,
              language: profile.nativeLanguage.code,
              user: {
                firstname: profile.user.firstname,
                lastname: profile.user.lastname,
              },
              university: {
                name: university.name,
                closeDate: formatInTimeZone(
                  university.closeServiceDate,
                  university.timezone,
                  'dd/MM/yyyy',
                ),
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
          closeDate: formatInTimeZone(
            university.closeServiceDate,
            university.timezone,
            'dd/MM/yyyy',
          ),
        },
      });
    });

    const sessionsOneDayFromBeingStarted =
      await this.sessionRepository.findSessionsOneDayFromBeingStarted();

    sessionsOneDayFromBeingStarted.forEach(async (session) => {
      const tandem = await this.tandemRepository.ofId(session.tandemId);

      if (!tandem || !tandem.learningLanguages) {
        return;
      }

      const profile1 = tandem.learningLanguages[0].profile;
      const profile2 = tandem.learningLanguages[1].profile;

      await this.sendSessionStart(profile1, profile2, tandem, session, 'Daily');
      await this.sendSessionStart(profile2, profile1, tandem, session, 'Daily');
    });
  }

  @Cron('45 * * * * *') // Every minutes at 45 seconds
  async processEveryMinutesNotifications() {
    this.#logger.log('processEveryMinutesNotifications');

    const sessionsFifteenMinutesFromBeingStarted =
      await this.sessionRepository.findSessionsFifteenMinutesFromBeingStarted();

    sessionsFifteenMinutesFromBeingStarted.forEach(async (session) => {
      const tandem = await this.tandemRepository.ofId(session.tandemId);

      if (!tandem || !tandem.learningLanguages) {
        return;
      }

      const profile1 = tandem.learningLanguages[0].profile;
      const profile2 = tandem.learningLanguages[1].profile;

      await this.sendSessionStart(
        profile1,
        profile2,
        tandem,
        session,
        'FifteenMinutes',
      );
      await this.sendSessionStart(
        profile2,
        profile1,
        tandem,
        session,
        'FifteenMinutes',
      );
    });
  }

  private async sendSessionStart(
    profile: Profile,
    partner: Profile,
    tandem: Tandem,
    session: Session,
    type: 'FifteenMinutes' | 'Daily',
  ) {
    const university = profile.user.university;

    if (!profile.user.acceptsEmail) {
      return;
    }

    this.emailGateway.sendSessionStartEmail({
      to: profile.user.email,
      language: profile.nativeLanguage.code,
      user: {
        firstname: profile.user.firstname,
        lastname: profile.user.lastname,
      },
      session: {
        date: formatInTimeZone(
          session.startAt,
          university.timezone,
          'dd/MM/yyyy',
        ),
        hour: formatInTimeZone(session.startAt, university.timezone, 'HH:mm'),
        partnerName: partner.user.firstname,
        comment: session.comment || '',
      },
      type,
    });

    await this.notificationGateway.sendSessionStartNotification({
      type,
      to: profile.user.devices.map((device) => ({
        token: device.token,
        language: profile.nativeLanguage.code,
      })),
      session: {
        date: formatInTimeZone(
          session.startAt,
          university.timezone,
          'dd/MM/yyyy',
        ),
        hour: formatInTimeZone(session.startAt, university.timezone, 'HH:mm'),
        partnerName: partner.user.firstname,
      },
    });
  }
}
