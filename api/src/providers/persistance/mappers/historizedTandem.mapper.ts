import { HistorizedTandem } from 'src/core/models/historized-tandem.model';
import * as Prisma from '@prisma/client';
import { PurgeSnapshot, purgeMapper } from './purge.mapper';

export const HistorizedTandemRelation = {
  Purge: true,
};

export type HistorizedTandemSnapshot = Prisma.TandemHistory & {
  Purge: PurgeSnapshot;
};

export const historizedTandemMapper = (
  instance: HistorizedTandemSnapshot,
): HistorizedTandem =>
  new HistorizedTandem({
    id: instance.id,
    userId: instance.user_id,
    purge: purgeMapper(instance.Purge),
    createdAt: instance.created_at,
  });
