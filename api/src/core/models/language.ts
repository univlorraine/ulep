import { v4 } from 'uuid';

export interface LanguageProps {
  name: string;
  code: string;
  isEnable: boolean;
}

export class Language {
  #id: string;
  #name: string;
  #code: string;
  #isEnable: boolean;

  constructor(props: { id: string } & LanguageProps) {
    this.#id = props.id;
    this.#name = props.name;
    this.#code = props.code;
    this.#isEnable = props.isEnable;
  }

  static create(props: LanguageProps) {
    const id = v4();
    return new Language({ id, ...props });
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get code() {
    return this.#code;
  }

  get isEnable() {
    return this.#isEnable;
  }

  set isEnable(isEnable: boolean) {
    this.#isEnable = isEnable;
  }
}
