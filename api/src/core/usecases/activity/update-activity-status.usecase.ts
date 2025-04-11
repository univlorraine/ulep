/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
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
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
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
    await this.handleLogEntry(activity, command.status);

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

  private async handleLogEntry(activity: Activity, status: ActivityStatus) {
    const learningLanguages = activity.creator?.learningLanguages || [];

    for (const learningLanguage of learningLanguages) {
      if (learningLanguage && status === ActivityStatus.IN_VALIDATION) {
        await this.createOrUpdateLogEntryUsecase.execute({
          learningLanguageId: learningLanguage.id,
          type: LogEntryType.SUBMIT_ACTIVITY,
          metadata: {
            activityId: activity.id,
            activityTitle: activity.title,
          },
        });
      }

      if (learningLanguage && status === ActivityStatus.PUBLISHED) {
        await this.createOrUpdateLogEntryUsecase.execute({
          learningLanguageId: learningLanguage.id,
          type: LogEntryType.PUBLISH_ACTIVITY,
          metadata: {
            activityId: activity.id,
            activityTitle: activity.title,
          },
        });
      }
    }
  }
}
