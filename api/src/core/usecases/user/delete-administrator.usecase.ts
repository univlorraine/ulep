import { Inject, Injectable } from '@nestjs/common';
import { KeycloakClient, KeycloakRealmRoles } from '@app/keycloak';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  CONTACT_REPOSITORY,
  ContactRepository,
} from 'src/core/ports/contact.repository';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
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
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(command: DeleteAdministratorCommand) {
    const hasProfile = await this.profileRepository.ofUser(command.id);

    await this.contactRepository.delete(command.id);

    if (!hasProfile) {
      return this.keycloak.deleteUser(command.id);
    }

    await this.chatService.deleteConversationByContactId(command.id);

    await this.keycloak.removeRealmRoleToUser(
      command.id,
      KeycloakRealmRoles.ADMIN,
    );
  }
}
