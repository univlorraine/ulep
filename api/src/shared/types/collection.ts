import { Expose } from 'class-transformer';

export class Collection<T> {
  @Expose({ groups: ['read'] })
  items: T[];

  @Expose({ groups: ['read'] })
  totalItems: number;

  constructor(items: T[], totalItems: number) {
    this.items = items;
    this.totalItems = totalItems;
  }
}
