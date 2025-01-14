import { Prisma } from '@prisma/client';
import { CommunityChat } from 'src/core/models/community-chat.model';
import {
  languageMapper,
  LanguageSnapshot,
} from 'src/providers/persistance/mappers/language.mapper';

export const CommunityChatInclude =
  Prisma.validator<Prisma.CommunityChatInclude>()({
    CentralLanguage: true,
    PartnerLanguage: true,
  });

export const CommunityChatRelations = {
  include: CommunityChatInclude,
};

export type CommunityChatSnapshot = Prisma.CommunityChatGetPayload<
  typeof CommunityChatRelations
> & {
  CentralLanguage: LanguageSnapshot;
  PartnerLanguage: LanguageSnapshot;
};

export const communityChatMapper = (
  snapshot: CommunityChatSnapshot,
): CommunityChat => ({
  id: snapshot.id,
  centralLanguage: languageMapper(snapshot.CentralLanguage),
  partnerLanguage: languageMapper(snapshot.PartnerLanguage),
});
