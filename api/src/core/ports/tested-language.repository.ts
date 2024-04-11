import { TestedLanguage } from 'src/core/models/tested-language.model';

export const TESTED_LANGUAGE_REPOSITORY = 'tested-language.repository';

export interface TestedLanguageRepository {
  create(profileId: string, testedLanguage: TestedLanguage): Promise<void>;

  delete(profileId: string, langaugeCode: string): Promise<void>;

  update(profileId: string, testedLanguage: TestedLanguage): Promise<void>;
}
