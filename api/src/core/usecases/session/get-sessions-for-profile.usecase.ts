import { Inject, Injectable } from '@nestjs/common';
import {
  SessionRepository,
  SESSION_REPOSITORY,
} from 'src/core/ports/session.repository';

export class GetSessionsForProfileUsecaseCommand {
  profileId: string;
}

@Injectable()
export class GetSessionsForProfileUsecase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: GetSessionsForProfileUsecaseCommand) {
    const sessions = await this.sessionRepository.findAllByProfileId(
      command.profileId,
    );

    return sessions;
  }
}
