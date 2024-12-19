import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LanguageResponse } from 'src/api/dtos/languages';
import { VocabularyList } from 'src/core/models/vocabulary.model';

export class VocabularyListResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read', 'chat'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'chat'] })
  name: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'chat'] })
  symbol: string;

  @Swagger.ApiProperty({ type: () => LanguageResponse })
  @Expose({ groups: ['read'] })
  translationLanguage: LanguageResponse;

  //TODO: remove this property if useless
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  editorsIds: string[];

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  isEditable: boolean;

  @Swagger.ApiProperty({ type: () => LanguageResponse })
  @Expose({ groups: ['read'] })
  wordLanguage: LanguageResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'chat'] })
  creatorId: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read', 'chat'] })
  creatorName: string;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  numberOfVocabularies: number;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  missingPronunciationOfWords: number;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  missingPronunciationOfTranslations: number;

  constructor(partial: Partial<VocabularyListResponse>) {
    Object.assign(this, partial);
  }

  static from(
    vocabularyList: VocabularyList,
    profileId?: string,
  ): VocabularyListResponse {
    return new VocabularyListResponse({
      id: vocabularyList.id,
      name: vocabularyList.name,
      symbol: vocabularyList.symbol,
      editorsIds: vocabularyList.editors.map((profile) => profile.id),
      isEditable:
        vocabularyList.editors.some((editor) => editor.id === profileId) ||
        vocabularyList.creator.id === profileId,
      wordLanguage: LanguageResponse.fromLanguage(vocabularyList.wordLanguage),
      translationLanguage: LanguageResponse.fromLanguage(
        vocabularyList.translationLanguage,
      ),
      creatorId: vocabularyList.creator.id,
      creatorName: `${vocabularyList.creator.user.firstname} ${vocabularyList.creator.user.lastname}`,
      numberOfVocabularies: vocabularyList.vocabularies.length,
      missingPronunciationOfWords: vocabularyList.vocabularies.filter(
        (vocabulary) => !vocabulary.pronunciationWord,
      ).length,
      missingPronunciationOfTranslations: vocabularyList.vocabularies.filter(
        (vocabulary) => !vocabulary.pronunciationTranslation,
      ).length,
    });
  }
}
