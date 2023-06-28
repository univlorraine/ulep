export interface UserProps {
  id: string;
  email: string;
  roles?: Role[];
}

export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

export class User {
  #id: string;
  #email: string;
  #roles: Role[];

  constructor(props: UserProps) {
    this.#id = props.id;
    this.email = props.email;
    this.roles = props.roles || [Role.ROLE_USER];
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

  set email(email: string) {
    if ('' === email.trim()) {
      throw new Error('Email cannot be empty');
    }

    this.#email = email;
  }

  get roles(): Role[] {
    // guarantee every user at least has role USER
    return this.#roles || [Role.ROLE_USER];
  }

  set roles(roles: Role[]) {
    this.#roles = roles;
  }
}
