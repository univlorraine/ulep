export class Paginator<T> {
  #items: T[];
  #offset: number;
  #limit: number;
  #take: number;
  #total: number;

  constructor(
    items: T[],
    offset: number,
    limit: number,
    take: number,
    total: number,
  ) {
    this.#items = items;
    this.#offset = offset;
    this.#limit = limit;
    this.#take = take;
    this.#total = total;
  }

  get currentPage(): number {
    return Math.floor(this.#offset / this.#limit) + 1;
  }

  get firstIndex(): number {
    return this.#offset;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.lastPage;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get items(): T[] {
    return [...this.#items];
  }

  get lastIndex(): number {
    return this.#offset + this.#limit;
  }

  get lastPage(): number {
    return Math.ceil(this.#total / this.#limit);
  }

  get nextPage(): number {
    return Math.min(this.lastPage, this.currentPage + 1);
  }

  get previousPage(): number {
    return Math.max(1, this.currentPage - 1);
  }

  get take(): number {
    return this.#take;
  }

  get total(): number {
    return this.#total;
  }
}
