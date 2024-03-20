import { Language } from './language.model';
import Purge from './purge.model';

export interface HistorizedTandemProps {
  id: string;
  userId: string;
  userEmail: string;
  purge: Purge;
  createdAt: Date;
  language: Language;
  tandemId: string;
}

export class HistorizedTandem {
  readonly id: string;
  readonly userId: string;
  readonly userEmail: string;
  readonly purge: Purge;
  readonly createdAt: Date;
  readonly language: Language;
  readonly tandemId: string;

  constructor(props: HistorizedTandemProps) {
    this.id = props.id;
    this.purge = props.purge;
    this.userId = props.userId;
    this.userEmail = props.userEmail;
    this.createdAt = props.createdAt;
    this.language = props.language;
    this.tandemId = props.tandemId;
  }
}
