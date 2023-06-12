import { v4 } from 'uuid';

export class University {
  #id: string;

  #name: string;

  constructor(id: string, name: string) {
    this.#id = id;
    this.#name = name;
  }

  static create(name: string): University {
    const id = v4();
    return new University(id, name);
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  set name(name: string) {
    this.#name = name;
  }
}
