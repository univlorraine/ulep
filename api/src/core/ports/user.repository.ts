import { Collection } from '@app/common';
import { Device, User, UserStatus } from '../models';

export const USER_REPOSITORY = 'user.repository';

export type WhereProps = {
  universityId?: string;
};

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

  count(props: WhereProps): Promise<number>;

  addDevice(id: string, props: Device): Promise<void>;

  removeDevice(id: string): Promise<void>;
}
