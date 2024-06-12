import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import { KeycloakClient } from '@app/keycloak';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import { ChatService } from 'src/providers/services/chat.service';

export class DeleteUserCommand {
  id: string;
  shouldKeepKeycloakUser?: boolean;
}

@Injectable()
export class DeleteUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly keycloak: KeycloakClient,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
  ) {}

  async execute(command: DeleteUserCommand) {
    const instance = await this.userRepository.ofId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    if (instance.avatar) {
      await this.storage.delete(instance.avatar.bucket, instance.avatar.name);
    }

    if (!command.shouldKeepKeycloakUser) {
      await this.keycloak.deleteUser(command.id);
    }

    await this.chatService.deleteConversationByUserId(command.id);

    return this.userRepository.delete(command.id);
  }
}
