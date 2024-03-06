import { Language } from './language.model';
import Purge from './purge.model';

export interface HistorizedTandemProps {
  id: string;
  userId: string;
  purge: Purge;
  createdAt: Date;
  // language: Language;
  //   TODO(NOW): decide what todo with langage_code_id
}

export class HistorizedTandem {
  readonly id: string;
  readonly userId: string;
  // readonly language: Language;
  readonly purge: Purge;
  readonly createdAt: Date;

  constructor(props: HistorizedTandemProps) {
    this.id = props.id;
    this.purge = props.purge;
    this.userId = props.userId;
    // this.language = props.language;
    this.createdAt = props.createdAt;
  }
}
