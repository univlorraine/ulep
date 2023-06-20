import { v4 } from 'uuid';

export interface CountryProps {
  name: string;
  code: string;
}

export class Country {
  #id: string;
  #code: string;
  #name: string;

  constructor(props: { id: string } & CountryProps) {
    this.#id = props.id;
    this.#code = props.code;
    this.#name = props.name;
  }

  static create(props: CountryProps): Country {
    const id = v4();
    return new Country({ id, ...props });
  }

  get id(): string {
    return this.#id;
  }

  get code(): string {
    return this.#code;
  }

  get name(): string {
    return this.#name;
  }
}
