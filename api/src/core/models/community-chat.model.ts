import { Language } from 'src/core/models/language.model';

export interface CommunityChatProps {
  id: string;
  centralLanguage: Language;
  partnerLanguage: Language;
}

export class CommunityChat {
  readonly id: string;
  readonly centralLanguage: Language;
  readonly partnerLanguage: Language;

  constructor({ id, centralLanguage, partnerLanguage }: CommunityChatProps) {
    this.id = id;
    this.centralLanguage = centralLanguage;
    this.partnerLanguage = partnerLanguage;
  }
}
