type SessionProps = {
  id: string;
  startAt: Date;
  comment: string;
  tandemId: string;
  cancelledAt: Date | null;
};

export class Session {
  readonly id: string;

  readonly startAt: Date;

  readonly comment: string;

  readonly tandemId: string;

  readonly cancelledAt: Date | null;

  constructor(props: SessionProps) {
    this.id = props.id;
    this.startAt = props.startAt;
    this.comment = props.comment;
    this.tandemId = props.tandemId;
    this.cancelledAt = props.cancelledAt;
  }
}
