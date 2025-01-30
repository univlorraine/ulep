import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { EmailGateway, EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';

export type SendEmailToSubscribedUsersCommand = {
  eventId: string;
  title: string;
  content: string;
};

@Injectable()
export class SendEmailToSubscribedUsersUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(command: SendEmailToSubscribedUsersCommand) {
    const event = await this.assertEventExists(command.eventId);

    const profiles = event.subscribedProfiles;

    await Promise.all(
      profiles.map((profile) => {
        this.emailGateway.sendEmailToSubscribedToEventUser({
          to: profile.user.email,
          title: command.title,
          content: command.content,
        });
      }),
    );
  }

  private async assertEventExists(id: string) {
    const event = await this.eventRepository.ofId(id);

    if (!event) {
      throw new RessourceDoesNotExist('Event does not exist');
    }

    return event;
  }
}
