import { Prisma } from '@prisma/client';
import { Vocabulary, VocabularyList } from 'src/core/models/vocabulary.model';
import { languageMapper } from 'src/providers/persistance/mappers/language.mapper';
import { profileMapper } from 'src/providers/persistance/mappers/profile.mapper';

export const VocabularyInclude = Prisma.validator<Prisma.VocabularyInclude>()({
  PronunciationWord: true,
  PronunciationTranslation: true,
});

export const VocabularyRelations = { include: VocabularyInclude };

export type VocabularySnapshot = Prisma.VocabularyGetPayload<
  typeof VocabularyRelations
>;

export const vocabularyMapper = (snapshot: VocabularySnapshot): Vocabulary => {
  return new Vocabulary({
    id: snapshot.id,
    word: snapshot.word,
    translation: snapshot.translation,
  });
};

export const VocabularyListInclude =
  Prisma.validator<Prisma.VocabularyListInclude>()({
    OriginalLanguage: true,
    TranslationLanguage: true,
    Editors: true,
    Vocabulary: VocabularyRelations,
  });

export const VocabularyListRelations = { include: VocabularyListInclude };

export type VocabularyListSnapshot = Prisma.VocabularyListGetPayload<
  typeof VocabularyListRelations
>;

export const vocabularyListMapper = (
  snapshot: VocabularyListSnapshot,
): VocabularyList => {
  return new VocabularyList({
    id: snapshot.id,
    name: snapshot.name,
    symbol: snapshot.symbol,
    profiles: snapshot.Editors.map(profileMapper),
    vocabularies: snapshot.Vocabulary.map(vocabularyMapper),
    wordLanguage: languageMapper(snapshot.OriginalLanguage),
    translationLanguage: languageMapper(snapshot.TranslationLanguage),
  });
};
