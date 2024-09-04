import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MediaObjectResponse } from 'src/api/dtos/medias';
import { Vocabulary } from 'src/core/models/vocabulary.model';

export class VocabularyResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  word: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  translation: string;

  @Swagger.ApiProperty({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  pronunciationWord?: MediaObjectResponse;

  @Swagger.ApiProperty({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  pronunciationTranslation?: MediaObjectResponse;

  constructor(partial: Partial<VocabularyResponse>) {
    Object.assign(this, partial);
  }

  static from(vocabulary: Vocabulary): VocabularyResponse {
    return new VocabularyResponse({
      id: vocabulary.id,
      word: vocabulary.word,
      translation: vocabulary.translation,
      pronunciationWord: vocabulary.pronunciationWord
        ? MediaObjectResponse.fromMediaObject(vocabulary.pronunciationWord)
        : undefined,
      pronunciationTranslation: vocabulary.pronunciationTranslation
        ? MediaObjectResponse.fromMediaObject(
            vocabulary.pronunciationTranslation,
          )
        : undefined,
    });
  }
}
