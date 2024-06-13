import { Collection } from '@app/common';
import { Device } from 'src/core/models';
import { User, UserStatus } from 'src/core/models/user.model';
import {
  UpdateUserResponse,
  UserRepository,
  WhereProps,
} from 'src/core/ports/user.repository';

export class InMemoryUserRepository implements UserRepository {
  #users: User[] = [];
  #blacklist: string[] = [];
  #devices: Device[] = [];

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

  async ofStatus(status: UserStatus): Promise<User[]> {
    const users = this.#users.filter((user) => user.status === status);

    return users;
  }

  async update(user: User): Promise<UpdateUserResponse> {
    const index = this.#users.findIndex((it) => it.id === user.id);

    if (index !== -1) {
      this.#users[index] = user;
    }

    return { user: this.#users[index], newContactId: null };
  }

  async delete(id: string): Promise<void> {
    const index = this.#users.findIndex((u) => u.id === id);

    if (index !== -1) {
      this.#users.splice(index, 1);
    }
  }

  async deleteAll(): Promise<void> {
    this.#users = [];
  }

  async blacklist(users: User[]): Promise<void> {
    const emails = users.map((user) => user.email);
    this.#blacklist = [...this.#blacklist, ...emails];
  }

  async isBlacklisted(email: string): Promise<boolean> {
    return this.#blacklist.includes(email);
  }

  async count(props: WhereProps): Promise<number> {
    return this.#users.filter(
      (user) => user.university?.id === props.universityId,
    ).length;
  }

  async addDevice(id: string, props: Device): Promise<void> {
    const user = this.#users.find((user) => user.id === id);
    this.#devices.push(props);

    if (user) {
      user.devices = [...user.devices, props];
    }

    return Promise.resolve();
  }

  async removeDevice(token: string): Promise<void> {
    const user = this.#users.find((user) =>
      user.devices.some((device) => device.token === token),
    );
    this.#devices = this.#devices.filter((device) => device.token !== token);

    if (user) {
      user.devices = user.devices.filter((device) => device.token !== token);
    }

    return Promise.resolve();
  }
}
