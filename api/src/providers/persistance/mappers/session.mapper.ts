import * as Prisma from '@prisma/client';
import { Session } from 'src/core/models/session.model';

export const sessionMapper = (instance: Prisma.Sessions): Session => {
  return new Session({
    id: instance.id,
    startAt: instance.start_at,
    comment: instance.comment,
    tandemId: instance.tandem_id,
    cancelledAt: instance.cancelled_at,
  });
};
