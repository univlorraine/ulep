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

import { Collection, PrismaService, SortOrder } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { startOfDay } from 'date-fns';
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
    orderBy,
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

    let order = { updated_at: 'desc' as SortOrder } as any;

    if (orderBy) {
      if (orderBy.field === 'author_university_name') {
        order = { AuthorUniversity: { name: orderBy.order } };
      } else if (orderBy.field === 'title') {
        order = { TitleTextContent: { text: orderBy.order } };
      } else if (orderBy.field === 'id') {
        order = { updated_at: 'desc' };
      } else {
        order = { [orderBy.field]: orderBy.order };
      }
    }

    const events = await this.prisma.events.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: order,
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
      AND: [
        {
          ...(filters.title && {
            TitleTextContent: {
              text: {
                contains: filters.title,
                mode: 'insensitive',
              },
            },
          }),
        },
        {
          ...(filters.universityId && {
            ConcernedUniversities: {
              some: {
                id: filters.universityId,
              },
            },
          }),
        },
        {
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
        },
        { status: filters.status },
        {
          end_date: {
            gte: startOfDay(new Date()),
          },
        },
        {
          ...(filters.types && {
            type: {
              in: filters.types,
            },
          }),
        },
      ],
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
        start_date: 'asc',
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
          connect: command.concernedUniversities?.map((university) => ({
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
          ...(props.concernedUniversities &&
            props.concernedUniversities.length > 0 && {
              connect: props.concernedUniversities.map((university) => ({
                id: university,
              })),
            }),
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
