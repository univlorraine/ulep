import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LanguageResponse } from 'src/api/dtos/languages';
import { VocabularyList } from 'src/core/models/vocabulary.model';

export class VocabularyListResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  symbol: string;

  @Swagger.ApiProperty({ type: LanguageResponse })
  @Expose({ groups: ['read'] })
  translationLanguage: LanguageResponse;

  @Swagger.ApiProperty({ type: LanguageResponse })
  @Expose({ groups: ['read'] })
  wordLanguage: LanguageResponse;

  constructor(partial: Partial<VocabularyListResponse>) {
    Object.assign(this, partial);
  }

  static from(vocabularyList: VocabularyList): VocabularyListResponse {
    return new VocabularyListResponse({
      id: vocabularyList.id,
      name: vocabularyList.name,
      symbol: vocabularyList.symbol,
      wordLanguage: LanguageResponse.fromLanguage(vocabularyList.wordLanguage),
      translationLanguage: LanguageResponse.fromLanguage(
        vocabularyList.translationLanguage,
      ),
    });
  }
}
