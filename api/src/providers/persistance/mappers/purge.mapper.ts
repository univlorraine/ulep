import * as Prisma from '@prisma/client';
import Purge from 'src/core/models/purge.model';

// export const PurgeRelations = {
// };

export type PurgeSnapshot = Prisma.Purges;

export const purgeMapper = (instance: PurgeSnapshot): Purge => {
  return {
    id: instance.id,
    createdAt: instance.created_at,
  };
};
