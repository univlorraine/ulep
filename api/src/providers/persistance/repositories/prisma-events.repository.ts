import { Collection, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EventObject } from 'src/core/models/event.model';
import {
  CreateEventProps,
  EventRepository,
  FindEventsForAnUserProps,
  FindEventsProps,
  SubscribeToEventProps,
  UnsubscribeToEventProps,
  UpdateEventProps,
} from 'src/core/ports/event.repository';
import { eventMapper, EventRelations } from '../mappers/events.mapper';

@Injectable()
export class PrismaEventRepository implements EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    pagination,
    filters,
  }: FindEventsProps): Promise<Collection<EventObject>> {
    const where: Prisma.EventsWhereInput = {
      TitleTextContent: {
        text: {
          contains: filters.title,
          mode: 'insensitive',
        },
      },
      ...(filters.authorUniversityId && {
        AuthorUniversity: {
          id: filters.authorUniversityId,
        },
      }),
      ...(filters.concernedUniversitiesIds && {
        ConcernedUniversities: {
          some: {
            id: {
              in: filters.concernedUniversitiesIds,
            },
          },
        },
      }),
      ...(filters.languageCode && {
        TitleTextContent: {
          OR: [
            {
              LanguageCode: {
                code: filters.languageCode,
              },
            },
            {
              Translations: {
                some: {
                  LanguageCode: { code: filters.languageCode },
                },
              },
            },
          ],
        },
      }),
      status: filters.status,
      type: {
        in: filters.types,
      },
    };

    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const count = await this.prisma.events.count({ where });

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const events = await this.prisma.events.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: {
        start_date: 'desc',
      },
      include: EventRelations,
    });

    return new Collection<EventObject>({
      items: events.map(eventMapper),
      totalItems: count,
    });
  }

  async findAllForAnUser({
    pagination,
    filters,
  }: FindEventsForAnUserProps): Promise<Collection<EventObject>> {
    const where: Prisma.EventsWhereInput = {
      TitleTextContent: {
        text: {
          contains: filters.title,
          mode: 'insensitive',
        },
      },
      ...(filters.universityId && {
        OR: [
          {
            ConcernedUniversities: {
              some: {
                id: filters.universityId,
              },
            },
          },
          {
            AuthorUniversity: {
              id: filters.universityId,
            },
          },
        ],
      }),
      ...(filters.allowedLanguages && {
        OR: filters.allowedLanguages.map((languageList) => ({
          DiffusionLanguages: {
            every: {
              code: {
                in: languageList,
              },
            },
          },
        })),
      }),
      status: filters.status,
      type: {
        in: filters.types,
      },
    };

    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const count = await this.prisma.events.count({ where });

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const events = await this.prisma.events.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: {
        start_date: 'desc',
      },
      include: EventRelations,
    });

    return new Collection<EventObject>({
      items: events.map(eventMapper),
      totalItems: count,
    });
  }

  async ofId(id: string): Promise<EventObject> {
    const event = await this.prisma.events.findUnique({
      where: { id },
      include: EventRelations,
    });

    return eventMapper(event);
  }

  async create(command: CreateEventProps): Promise<EventObject> {
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
            id: command.authorUniversityId,
          },
        },
        status: command.status,
        image_credit: command.imageCredit,
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
        start_date: command.startDate,
        end_date: command.endDate,
      },
      include: EventRelations,
    });

    return eventMapper(event);
  }

  async update(props: UpdateEventProps): Promise<EventObject> {
    const event = await this.prisma.events.update({
      where: { id: props.id },
      data: {
        TitleTextContent: {
          update: {
            text: props.title,
            LanguageCode: { connect: { code: props.languageCode } },
            Translations: {
              deleteMany: {},
              create: props.translations?.map((translation) => ({
                text: translation.title,
                LanguageCode: { connect: { code: translation.languageCode } },
              })),
            },
          },
        },
        ContentTextContent: {
          update: {
            text: props.content,
            LanguageCode: { connect: { code: props.languageCode } },
            Translations: {
              deleteMany: {},
              create: props.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.languageCode } },
              })),
            },
          },
        },
        AuthorUniversity: {
          connect: {
            id: props.authorUniversityId,
          },
        },
        status: props.status,
        type: props.type,
        image_credit: props.imageCredit,
        event_url: props.eventURL,
        address: props.address,
        address_name: props.addressName,
        deep_link: props.deepLink,
        with_subscription: props.withSubscription,
        ConcernedUniversities: {
          set: [],
          connect: props.concernedUniversities.map((university) => ({
            id: university,
          })),
        },
        DiffusionLanguages: {
          set: [],
          connect: props.diffusionLanguages.map((language) => ({
            code: language,
          })),
        },
        start_date: props.startDate,
        end_date: props.endDate,
      },
      include: EventRelations,
    });

    return eventMapper(event);
  }

  async subscribeToEvent(props: SubscribeToEventProps): Promise<EventObject> {
    const { eventId, profilesIds } = props;
    const event = await this.prisma.events.update({
      where: { id: eventId },
      data: {
        SubscribedProfiles: {
          connect: profilesIds.map((profile) => ({ id: profile })),
        },
      },
      include: EventRelations,
    });

    return eventMapper(event);
  }

  async unsubscribeToEvent(
    props: UnsubscribeToEventProps,
  ): Promise<EventObject> {
    const { eventId, profilesIds } = props;
    const event = await this.prisma.events.update({
      where: { id: eventId },
      data: {
        SubscribedProfiles: {
          disconnect: profilesIds.map((profile) => ({ id: profile })),
        },
      },
      include: EventRelations,
    });

    return eventMapper(event);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.events.delete({
      where: { id },
    });
  }
}
