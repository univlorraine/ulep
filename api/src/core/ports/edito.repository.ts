import { Edito } from '../models/edito.model';

export const EDITO_REPOSITORY = 'edito.repository';

export type CreateEditoCommand = {
  universityId: string;
  defaultLanguageCode: string;
  translationsLanguageCodes: string[];
};

export interface EditoRepository {
  create(props: CreateEditoCommand): Promise<Edito>;
  findAll(): Promise<Edito[]>;
}
