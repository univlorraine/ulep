import { Expose } from 'class-transformer';

export class Collection<T> {
  @Expose({ groups: ['read', 'chat'] })
  items: T[];

  @Expose({ groups: ['read', 'chat'] })
  totalItems: number;

  constructor(partial: Partial<Collection<T>>) {
    Object.assign(this, partial);
  }
}
