interface PurgeProps {
  id: string;
  createdAt: Date;
}

export default class Purge {
  readonly id: string;

  readonly createdAt: Date;

  constructor({ id, createdAt }: PurgeProps) {
    this.id = id;
    this.createdAt = createdAt;
  }
}
