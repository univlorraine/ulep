import MediaObject from './media-object';

export interface UserProps {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  avatar?: MediaObject;
  roles?: UserRole[];
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class User {
  #id: string;
  #email: string;
  #firstname?: string;
  #lastname?: string;
  #avatar?: MediaObject;
  #roles: UserRole[];

  constructor(props: UserProps) {
    this.#id = props.id;
    this.email = props.email;
    this.#firstname = props.firstname;
    this.#lastname = props.lastname;
    this.#avatar = props.avatar;
    this.roles = props.roles || [UserRole.USER];
  }

  static signUp(id: string, email: string, roles?: UserRole[]): User {
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

  get firstname(): string | undefined {
    return this.#firstname;
  }

  get lastname(): string | undefined {
    return this.#lastname;
  }

  get avatar(): MediaObject | undefined {
    return this.#avatar;
  }

  get roles(): UserRole[] {
    // guarantee every user at least has role USER
    return this.#roles || [UserRole.USER];
  }

  set roles(roles: UserRole[]) {
    this.#roles = roles;
  }
}
