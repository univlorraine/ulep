import { Language } from './language.model';
import Purge from './purge.model';

export interface HistorizedUnmatchedLearningLanguageProps {
  id: string;
  userId: string;
  purge: Purge;
  createdAt: Date;
  language: Language;
}

export class HistorizedUnmatchedLearningLanguage {
  readonly id: string;
  readonly userId: string;
  readonly purge: Purge;
  readonly createdAt: Date;
  readonly language: Language;

  constructor(props: HistorizedUnmatchedLearningLanguageProps) {
    this.id = props.id;
    this.purge = props.purge;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
    this.language = props.language;
  }
}
