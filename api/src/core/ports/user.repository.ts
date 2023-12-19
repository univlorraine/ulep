import { Collection } from '@app/common';
import { User, UserStatus } from '../models';

export const USER_REPOSITORY = 'user.repository';

export interface UserRepository {
  create(user: User): Promise<User>;

  findAll(offset?: number, limit?: number): Promise<Collection<User>>;

  ofId(id: string): Promise<User | null>;

  ofStatus(status: UserStatus): Promise<User[]>;

  update(user: User): Promise<User>;

  delete(id: string): Promise<void>;

  deleteAll(): Promise<void>;

  blacklist(users: User[]): Promise<void>;

  isBlacklisted(email: string): Promise<boolean>;
}
