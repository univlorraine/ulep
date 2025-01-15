import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import {
  addMinutes,
  endOfTomorrow,
  setSeconds,
  startOfTomorrow,
  subHours,
} from 'date-fns';
import { Session } from 'src/core/models/session.model';
import {
  CreateSessionProps,
  SessionRepository,
  UpdateSessionProps,
} from 'src/core/ports/session.repository';
import { sessionMapper } from '../mappers/session.mapper';

export const SESSION_REPOSITORY = 'session.repository';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string): Promise<Session | null> {
    const session = await this.prisma.sessions.findUnique({
      where: {
        id,
      },
    });

    if (!session) {
      return null;
    }

    return sessionMapper(session);
  }

  async create(props: CreateSessionProps): Promise<Session> {
    const session = await this.prisma.sessions.create({
      data: {
        start_at: props.startAt,
        comment: props.comment,
        Tandem: {
          connect: {
            id: props.tandemId,
          },
        },
      },
    });

    return sessionMapper(session);
  }

  async update(props: UpdateSessionProps): Promise<Session> {
    const session = await this.prisma.sessions.update({
      where: {
        id: props.id,
      },
      data: {
        start_at: props.startAt,
        comment: props.comment,
      },
    });

    return sessionMapper(session);
  }

  async cancel(id: string, comment?: string): Promise<Session> {
    const session = await this.prisma.sessions.update({
      where: {
        id,
      },
      data: {
        cancelled_at: new Date(),
        comment: comment,
      },
    });

    return sessionMapper(session);
  }

  async findAllByProfileId(profileId: string): Promise<Session[]> {
    const sessions = await this.prisma.sessions.findMany({
      where: {
        Tandem: {
          LearningLanguages: {
            some: {
              Profile: {
                id: {
                  equals: profileId,
                },
              },
            },
          },
        },
        start_at: {
          gte: subHours(new Date(), 2),
        },
      },
      orderBy: {
        start_at: 'asc',
      },
    });

    return sessions.map(sessionMapper);
  }

  async findSessionsOneDayFromBeingStarted(): Promise<Session[]> {
    const sessions = await this.prisma.sessions.findMany({
      where: {
        start_at: {
          gt: startOfTomorrow(),
          lt: endOfTomorrow(),
        },
        cancelled_at: null,
      },
    });

    return sessions.map(sessionMapper);
  }

  async findSessionsFifteenMinutesFromBeingStarted(): Promise<Session[]> {
    const now = setSeconds(new Date(Date.now()), 0);
    const startOfFifteenMinutesLater = addMinutes(now, 15);
    const endOfFifteenMinutesLater = setSeconds(startOfFifteenMinutesLater, 59);
    const sessions = await this.prisma.sessions.findMany({
      where: {
        start_at: {
          gt: startOfFifteenMinutesLater,
          lt: endOfFifteenMinutesLater,
        },
        cancelled_at: null,
      },
    });

    return sessions.map(sessionMapper);
  }
}
