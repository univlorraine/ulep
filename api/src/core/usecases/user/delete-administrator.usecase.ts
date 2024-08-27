import { KeycloakClient, KeycloakRealmRoles } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { Profile } from 'src/core/models';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import {
  CONTACT_REPOSITORY,
  ContactRepository,
} from 'src/core/ports/contact.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';
import { ChatService } from 'src/providers/services/chat.service';

export class DeleteAdministratorCommand {
  id: string;
}

@Injectable()
export class DeleteAdministratorUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(command: DeleteAdministratorCommand) {
    const profile = await this.profileRepository.ofUser(command.id);

    await this.contactRepository.delete(command.id);

    let chatIdsToIgnore = [];
    if (!profile) {
      return this.keycloak.deleteUser(command.id);
    } else {
      chatIdsToIgnore = await this.getTandemFromProfile(profile);
    }

    await this.chatService.deleteConversationByContactId(
      command.id,
      chatIdsToIgnore,
    );

    await this.keycloak.removeRealmRoleToUser(
      command.id,
      KeycloakRealmRoles.ADMIN,
    );
  }

  getTandemFromProfile = async (profile: Profile) => {
    const tandems = await this.tandemRepository.getTandemsForProfile(
      profile.id,
    );

    return tandems.map((tandem) => tandem.id);
  };
}
