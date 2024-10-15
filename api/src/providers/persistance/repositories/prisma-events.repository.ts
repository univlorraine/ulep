import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { EventObject } from 'src/core/models/event.model';
import {
  CreateEventProps,
  EventRepository,
} from 'src/core/ports/event.repository';
import { eventMapper, EventRelations } from '../mappers/events.mapper';

@Injectable()
export class PrismaEventRepository implements EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string): Promise<EventObject | null> {
    const event = await this.prisma.events.findUnique({
      where: { id },
      include: EventRelations,
    });

    return event ? eventMapper(event) : null;
  }

  async create(command: CreateEventProps): Promise<EventObject> {
    console.log({ command });
    const event = await this.prisma.events.create({
      data: {
        TitleTextContent: {
          create: {
            text: command.title,
            LanguageCode: { connect: { code: command.languageCode } },
            Translations: {
              create: command.translations?.map((translation) => ({
                text: translation.title,
                LanguageCode: { connect: { code: translation.languageCode } },
              })),
            },
          },
        },
        ContentTextContent: {
          create: {
            text: command.content,
            LanguageCode: { connect: { code: command.languageCode } },
            Translations: {
              create: command.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.languageCode } },
              })),
            },
          },
        },
        AuthorUniversity: {
          connect: {
            id: command.universityId,
          },
        },
        status: command.status,
        type: command.type,
        event_url: command.eventURL,
        address: command.address,
        address_name: command.addressName,
        deep_link: command.deepLink,
        with_subscription: command.withSubscription,
        ConcernedUniversities: {
          connect: command.concernedUniversities.map((university) => ({
            id: university,
          })),
        },
        DiffusionLanguages: {
          connect: command.diffusionLanguages.map((language) => ({
            code: language,
          })),
        },
        EnrolledUsers: {
          connect: command.enrolledUsers.map((user) => ({
            id: user,
          })),
        },
        start_date: command.startDate,
        end_date: command.endDate,
      },
      include: EventRelations,
    });

    return eventMapper(event);
  }
}
