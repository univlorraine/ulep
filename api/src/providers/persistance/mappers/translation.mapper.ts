import * as Prisma from '@prisma/client';
import { TextContent } from 'src/core/models';

export const TextContentRelations = {
  include: {
    LanguageCode: true,
    Translations: { include: { LanguageCode: true } },
  },
};

export type TextContentSnapshot = Prisma.TextContent & {
  LanguageCode: Prisma.LanguageCodes;
  Translations: (Prisma.Translations & {
    LanguageCode: Prisma.LanguageCodes;
  })[];
};

export const textContentMapper = (
  snapshot: TextContentSnapshot,
): TextContent => {
  return {
    id: snapshot.id,
    content: snapshot.text,
    language: snapshot.LanguageCode.code,
    translations: snapshot.Translations.map((t) => {
      return {
        content: t.text,
        language: t.LanguageCode.code,
      };
    }),
  };
};
