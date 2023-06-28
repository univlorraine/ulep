import { User } from '../../../core/models/user';
import { UserRepository } from '../../../core/ports/user.repository';
import { Collection } from '../../../shared/types/collection';

export class InMemoryUserRepository implements UserRepository {
  #users: User[] = [];

  get users(): User[] {
    return this.#users;
  }

  init(users: User[]): void {
    this.#users = users;
  }

  reset(): void {
    this.#users = [];
  }

  async all(offset?: number, limit?: number): Promise<Collection<User>> {
    return {
      items: this.#users.slice(offset, offset + limit),
      totalItems: this.#users.length,
    };
  }

  async ofId(id: string): Promise<User> {
    return this.#users.find((user) => user.id === id);
  }

  async ofEmail(email: string): Promise<User> {
    return this.#users.find((user) => user.email === email);
  }

  async save(user: User): Promise<void> {
    const index = this.#users.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      this.#users[index] = user;
    } else {
      this.#users.push(user);
    }
  }
}
