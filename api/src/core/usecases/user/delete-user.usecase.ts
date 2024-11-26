import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import { DeleteAvatarUsecase } from 'src/core/usecases/media';
import { ChatService } from 'src/providers/services/chat.service';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';

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
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
    @Inject(DeleteAvatarUsecase)
    private readonly deleteAvatarUsecase: DeleteAvatarUsecase,
  ) {}

  async execute(command: DeleteUserCommand) {
    const instance = await this.userRepository.ofId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    if (instance.avatar) {
      await this.deleteAvatarUsecase.execute({
        userId: instance.id,
      });
    }

    if (!command.shouldKeepKeycloakUser) {
      await this.keycloak.deleteUser(command.id);
    }

    await this.chatService.deleteConversationByUserId(command.id);

    return this.userRepository.delete(command.id);
  }
}
