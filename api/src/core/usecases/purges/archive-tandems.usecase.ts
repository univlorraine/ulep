import { KeycloakClient } from '@app/keycloak';
import { Inject, Logger } from '@nestjs/common';
import {
  ReportStatus,
  Tandem,
  TandemStatus,
  UserStatus,
} from 'src/core/models';
import Purge from 'src/core/models/purge.model';
import {
  PURGE_REPOSITORY,
  PurgeRepository,
} from 'src/core/ports/purge.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';
import { User } from 'src/core/models';
import {
  REPORT_REPOSITORY,
  ReportRepository,
} from 'src/core/ports/report.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export class UserTandemPurgeCommand {
  userId: string;
}

/// Iterate through all archived tandems and delete users (in Keycloak) who do not have a tandem (they did not register after the last purge).
/// We should create specifics usecases for each step of the purge process. (delete users, delete tandems, delete reports, blacklist, ;()...)
export class archiveTandemsAndDeleteUsersUsecase {
  private readonly logger = new Logger(
    archiveTandemsAndDeleteUsersUsecase.name,
  );

  constructor(
    @Inject(PURGE_REPOSITORY)
    private readonly purgeRepository: PurgeRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
    // TOOD: create interface for KeycloakClient ?
    private readonly keycloak: KeycloakClient,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: UserTandemPurgeCommand): Promise<Purge> {
    // Create purge
    const purge = await this.createNewPurge(command.userId);

    // Save active tandems then delete it
    const activeTandems = await this.archiveTandems(purge.id);

    // Delete users
    const users = (await this.userRepository.findAll()).items;
    const usersWithActiveTandem = this.getUserIdFromTandems(activeTandems);

    await Promise.all([
      this.blacklistUsers(users),
      this.deleteUsers(usersWithActiveTandem),
    ]);

    // 4. Delete closed reports
    await this.deleteClosedReports();

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

    await Promise.all([
      this.tandemRepository.archiveTandems(activeTandems.items, purgeId),
      this.tandemRepository.deleteAll(),
    ]);

    return activeTandems.items;
  }

  private async deleteUsers(usersWithActiveTandem: string[]): Promise<void> {
    // Retrieve all administrators
    const administratorsId = (await this.keycloak.getAdministrators()).map(
      (administrator) => administrator.id,
    );
    // Retrieve the total number of users in keycloak
    const usersCount = await this.keycloak.getUsersCount();
    // Retrieve all users from keycloak
    const keycloakUsers = await this.keycloak.getUsers({ max: usersCount });
    // Loop through all users in keycloak
    for (const user of keycloakUsers) {
      // Check if the user is an administrator
      const isAdministrator = administratorsId.includes(user.id);
      // Check if the user has an active tandem
      const isUserWithActiveTandem = usersWithActiveTandem.includes(user.id);
      if (isAdministrator || isUserWithActiveTandem) {
        // If the user is an administrator or has an active tandem, skip
        continue;
      }
      // If the user is not an administrator and does not have an active tandem, delete it
      await this.keycloak.deleteUser(user.id);
    }

    // Finally, delete all users from the application. Users with active tandems
    // will still be in keycloak in case they want to register again in the next campaign.
    await this.userRepository.deleteAll();
  }

  private async blacklistUsers(users: User[]): Promise<void> {
    const banned = users
      .filter((user) => user.status === UserStatus.BANNED)
      .map((user) => user.id);

    await this.userRepository.createBlacklist(banned);
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
