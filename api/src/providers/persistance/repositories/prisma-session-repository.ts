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
