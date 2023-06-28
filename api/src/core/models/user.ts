export interface UserProps {
  id: string;
  email: string;
  roles?: Role[];
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class User {
  #id: string;
  #email: string;
  #roles: Role[];

  constructor(props: UserProps) {
    this.#id = props.id;
    this.#email = props.email;
    this.#roles = props.roles || [Role.USER];
  }

  static signUp(id: string, email: string, roles?: Role[]): User {
    return new User({ id, email, roles });
  }

  get id(): string {
    return this.#id;
  }

  get email(): string {
    return this.#email;
  }

  get roles(): Role[] {
    // guarantee every user at least has role USER
    return this.#roles || [Role.USER];
  }
}
