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

import { KeycloakClient } from '@app/keycloak';
import { Inject, Logger } from '@nestjs/common';
import {
  ReportStatus,
  Tandem,
  TandemStatus,
  UserStatus,
} from 'src/core/models';
import Purge from 'src/core/models/purge.model';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import {
  CommunityChatRepository,
  COMMUNITY_CHAT_REPOSITORY,
} from 'src/core/ports/community-chat.repository';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  PurgeRepository,
  PURGE_REPOSITORY,
} from 'src/core/ports/purge.repository';
import {
  ReportRepository,
  REPORT_REPOSITORY,
} from 'src/core/ports/report.repository';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';
import {
  UuidProviderInterface,
  UUID_PROVIDER,
} from 'src/core/ports/uuid.provider';
import { ChatService } from 'src/providers/services/chat.service';
import { DeleteUserUsecase } from '../user';

export class UserTandemPurgeCommand {
  userId: string;
}

/// Iterate through all archived tandems and delete users (in Keycloak) who do not have a tandem (they did not register after the last purge).
/// We should create specifics usecases for each step of the purge process. (delete users, delete tandems, delete reports, blacklist, ;()...)
export class ArchiveTandemsAndDeleteUsersUsecase {
  private readonly logger = new Logger(
    ArchiveTandemsAndDeleteUsersUsecase.name,
  );

  constructor(
    @Inject(PURGE_REPOSITORY)
    private readonly purgeRepository: PurgeRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
    // TOOD: create interface for KeycloakClient ?
    private readonly keycloak: KeycloakClient,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
    @Inject(DeleteUserUsecase)
    private readonly deleteUsersUsecase: DeleteUserUsecase,
    @Inject(COMMUNITY_CHAT_REPOSITORY)
    private readonly communityChatRepository: CommunityChatRepository,
  ) {}

  async execute(command: UserTandemPurgeCommand): Promise<Purge> {
    // Create purge
    console.log('[Purge] Create new purge');
    const purge = await this.createNewPurge(command.userId);
    // Blacklist users who have been banned
    console.log('[Purge] Blacklist users who have been banned');
    await this.blacklistUsers();
    // Archive all unmatched learning languages
    console.log('[Purge] Archive all unmatched learning languages');
    const userWithUnmatchedLearningLanguages =
      await this.archiveUnmatchedLearningLanguages(purge.id);
    // Retrieve all users who have an active tandem
    console.log('[Purge] Archive all active tandems');
    const activeTandems = await this.archiveTandems(purge.id);
    console.log('[Purge] Retrieve all users who have an active tandem');
    const usersWithActiveTandem = this.getUserIdFromTandems(activeTandems);
    // Delete inactives users and are not administrators
    console.log('[Purge] Delete users');
    await this.deleteUsers([
      ...usersWithActiveTandem,
      ...userWithUnmatchedLearningLanguages,
    ]);
    // Delete closed reports
    console.log('[Purge] Delete closed reports');
    await this.deleteClosedReports();
    // Delete everything in chat api
    console.log('[Purge] Delete all conversations in chat api');
    await this.chatService.deleteAllConversations();
    // Delete all community chats
    console.log('[Purge] Delete all community chats');
    await this.communityChatRepository.deleteAll();

    console.log('[Purge] Purge completed');
    return purge;
  }

  private async createNewPurge(user: string): Promise<Purge> {
    const purge = await this.purgeRepository.create(
      this.uuidProvider.generate(),
      user,
    );

    return purge;
  }

  private async archiveTandems(purgeId: string): Promise<Tandem[]> {
    const activeTandems = await this.tandemRepository.findWhere({
      status: TandemStatus.ACTIVE,
    });
    console.log(
      '[Purge] Archive all active tandems - Active tandems retreived',
    );

    await Promise.all([
      this.tandemRepository.archiveTandems(activeTandems.items, purgeId),
      this.tandemRepository.deleteAll(),
    ]);
    console.log(
      '[Purge] Archive all active tandems - Active tandems archived and all tandems deleted',
    );

    return activeTandems.items;
  }

  private async archiveUnmatchedLearningLanguages(purgeId: string) {
    const unmatchedLearningLanguages =
      await this.learningLanguageRepository.getUnmatchedLearningLanguages();
    console.log(
      '[Purge] Archive all unmatched learning languages - Unmatched learning languages retreived',
    );

    await this.learningLanguageRepository.archiveUnmatchedLearningLanguages(
      unmatchedLearningLanguages,
      purgeId,
    );
    console.log(
      '[Purge] Archive all unmatched learning languages - Unmatched learning languages archived',
    );

    return unmatchedLearningLanguages.map((l) => l.profile.user.id);
  }

  private async deleteUsers(usersToKeep: string[]): Promise<void> {
    // Retrieve all administrators
    const administratorsIds = (await this.keycloak.getAdministrators()).map(
      (administrator) => administrator.id,
    );
    console.log(
      '[Purge] Delete users - Administrators retreived from Keycloak',
    );
    // Retrieve the total number of users in keycloak
    const usersCount = await this.keycloak.getUsersCount();
    console.log('[Purge] Delete users - Users count retreived from Keycloak');
    // Retrieve all users from keycloak
    const keycloakUsers = await this.keycloak.getUsers({ max: usersCount });
    console.log('[Purge] Delete users - Users retreived from Keycloak');
    // Loop through all users in keycloak
    for (const user of keycloakUsers) {
      // Check if the user is an administrator
      const isAdministrator = administratorsIds.includes(user.id);
      // Check if the user has an active tandem
      const isUserWithActiveTandem = usersToKeep.includes(user.id);
      if (isAdministrator || isUserWithActiveTandem) {
        // If the user is an administrator or has an active tandem, skip
        continue;
      }
      // If the user is not an administrator and does not have an active tandem, delete it
      await this.keycloak.deleteUser(user.id);
    }
    console.log('[Purge] Delete users - Keycloak users deleted');

    // Finally, delete all users from the application. Users with active tandems
    // will still be in keycloak in case they want to register again in the next campaign.
    // We call the deleteUsersUsecase for each user to delete the user's image from the storage.
    const users = await this.userRepository.findAll();
    console.log('[Purge] Delete users - Users retreived from database');
    for (const user of users.items) {
      await this.deleteUsersUsecase.execute({
        id: user.id,
        shouldKeepKeycloakUser: true,
      });
    }
    console.log('[Purge] Delete users - Users deleted from database');
  }

  private async blacklistUsers(): Promise<void> {
    const users = await this.userRepository.ofStatus(UserStatus.BANNED);
    console.log(
      '[Purge] Blacklist users who have been banned - Users retreived',
    );
    await this.userRepository.blacklist(users);
    console.log(
      '[Purge] Blacklist users who have been banned - Users blacklisted',
    );
  }

  private async deleteClosedReports(): Promise<void> {
    await this.reportRepository.deleteManyReports({
      status: ReportStatus.CLOSED,
    });
  }

  /// Return the user's id from given tandem
  private getUserIdFromTandems(tandems: Tandem[]): string[] {
    const userIds: string[] = [];
    for (const tandem of tandems) {
      for (const language of tandem.learningLanguages) {
        userIds.push(language.profile.user.id);
      }
    }
    return userIds;
  }
}
