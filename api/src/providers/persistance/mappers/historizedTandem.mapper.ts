import { HistorizedTandem } from 'src/core/models/historized-tandem.model';
import * as Prisma from '@prisma/client';
import { PurgeSnapshot, purgeMapper } from './purge.mapper';
import { LanguageSnapshot, languageMapper } from './language.mapper';

export const HistorizedTandemRelation = {
  Purge: true,
  Language: true,
};

export type HistorizedTandemSnapshot = Prisma.TandemHistory & {
  Purge: PurgeSnapshot;
  Language: LanguageSnapshot;
};

export const historizedTandemMapper = (
  instance: HistorizedTandemSnapshot,
): HistorizedTandem =>
  new HistorizedTandem({
    id: instance.id,
    userId: instance.user_id,
    userEmail: instance.user_email,
    tandemId: instance.tandem_id,
    purge: purgeMapper(instance.Purge),
    createdAt: instance.created_at,
    language: languageMapper(instance.Language),
  });
