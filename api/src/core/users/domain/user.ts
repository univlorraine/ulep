export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class User {
  private constructor(
    private id: string,
    private email: string,
    private roles: Role[],
  ) {}

  static signUp(id: string, email: string, roles: Role[] = []): User {
    return new User(id, email, roles);
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRoles(): Role[] {
    // guarantee every user at least has role USER
    return this.roles.indexOf(Role.USER) === -1
      ? [Role.USER, ...this.roles]
      : [...this.roles];
  }
}
