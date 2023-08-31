import { Collection } from '@app/common';
import { User } from 'src/core/models/user.model';
import { UserRepository } from 'src/core/ports/user.repository';

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

  async create(user: User): Promise<User> {
    const index = this.#users.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      this.#users[index] = user;
    } else {
      this.#users.push(user);
    }

    return user;
  }

  async findAll(offset?: number, limit?: number): Promise<Collection<User>> {
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

  async update(user: User): Promise<User> {
    const index = this.#users.findIndex((it) => it.id === user.id);

    if (index !== -1) {
      this.#users[index] = user;
    }

    return this.#users[index];
  }

  async remove(id: string): Promise<void> {
    const index = this.#users.findIndex((u) => u.id === id);

    if (index !== -1) {
      this.#users.splice(index, 1);
    }
  }
}
