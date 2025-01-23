import { Edito, EditoTranslation } from '../models/edito.model';

export const EDITO_REPOSITORY = 'edito.repository';

export type CreateEditoCommand = {
  universityId: string;
  defaultLanguageCode: string;
  translationsLanguageCodes: string[];
};

export type UpdateEditoCommand = {
  id: string;
  content: string;
  languageCode: string;
  translations: EditoTranslation[];
};

export interface EditoRepository {
  create(props: CreateEditoCommand): Promise<Edito>;
  findAll(): Promise<Edito[]>;
  findById(id: string): Promise<Edito>;
  findByUniversityId(universityId: string): Promise<Edito>;
  update(props: UpdateEditoCommand): Promise<Edito>;
}
