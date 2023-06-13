export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class User {
  constructor(
    private id: string,
    private email: string,
    private role: Role[],
  ) {}

  static signUp(id: string, email: string, role?: Role[]): User {
    return new User(id, email, role);
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRole(): Role[] {
    // guarantee every user at least has role USER
    return this.role || [Role.USER];
  }
}
