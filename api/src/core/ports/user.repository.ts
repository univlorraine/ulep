import { Collection } from '@app/common';
import { User } from '../models';

export const USER_REPOSITORY = 'user.repository';

export interface UserRepository {
  createBlacklist(usersId: string[]): Promise<void>;

  create(user: User): Promise<User>;

  findAll(offset?: number, limit?: number): Promise<Collection<User>>;

  ofId(id: string): Promise<User | null>;

  update(user: User): Promise<User>;

  delete(id: string): Promise<void>;

  deleteAll(): Promise<void>;
}
