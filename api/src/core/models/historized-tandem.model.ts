import Purge from './purge.model';

export interface HistorizedTandemProps {
  id: string;
  userId: string;
  purge: Purge;
  createdAt: Date;
  //   TODO(NOW): decide what todo with langage_code_id
}

export class HistorizedTandem {
  readonly id: string;
  readonly userId: string;
  readonly purge: Purge;
  readonly createdAt: Date;

  constructor(props: HistorizedTandemProps) {
    this.id = props.id;
    this.purge = props.purge;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
  }
}
