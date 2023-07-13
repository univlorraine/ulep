export interface LanguageProps {
  name: string;
  code: string;
  isEnable: boolean;
}

export class Language {
  #name: string;
  #code: string;
  #isEnable: boolean;

  constructor(props: LanguageProps) {
    this.#name = props.name;
    this.#code = props.code;
    this.#isEnable = props.isEnable;
  }

  static create(props: LanguageProps) {
    return new Language({ ...props });
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
