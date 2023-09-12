import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { configuration } from 'src/configuration';
import { TextContent, Translation } from 'src/core/models';

export class TranslationResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  language: string;

  constructor(partial: Partial<TranslationResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(translation: Translation): TranslationResponse {
    return new TextContentResponse({
      content: translation.content,
      language: translation.language,
    });
  }
}

export class TextContentResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  language: string;

  @Swagger.ApiProperty({ type: TranslationResponse })
  @Expose({ groups: ['read'] })
  translations: TranslationResponse[];

  constructor(partial: Partial<TextContentResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(textContent: TextContent): TextContentResponse {
    return new TextContentResponse({
      id: textContent.id,
      content: textContent.content,
      language: textContent.language,
      translations: textContent.translations.map((translation) =>
        TranslationResponse.fromDomain(translation),
      ),
    });
  }
}

export const textContentTranslationResponse = (
  textContent: TextContent,
  languageCode: string,
) => {
  const code =
    configuration().defaultTranslationLanguage !== languageCode
      ? languageCode
      : undefined;
  if (!code) {
    return textContent.content;
  } else {
    const translation = textContent.translations.find(
      (translation) => translation.language === code,
    )?.content;

    return translation || textContent.content;
  }
};
