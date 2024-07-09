import { Expose } from 'class-transformer';

export class Collection<T> {
  @Expose({ groups: ['read'] })
  items: T[];

  @Expose({ groups: ['read'] })
  totalItems: number;

  constructor(partial: Partial<Collection<T>>) {
    Object.assign(this, partial);
  }
}
