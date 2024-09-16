import { Collection } from '@app/common';
import { Device, User, UserStatus } from '../models';

export const USER_REPOSITORY = 'user.repository';

export type WhereProps = {
  universityId?: string;
};

export interface UpdateUserResponse {
  user: User;
  newContactId: string;
}

export interface UserRepository {
  create(user: User): Promise<User>;

  findAll(offset?: number, limit?: number): Promise<Collection<User>>;

  findByUniversityId(universityId: string): Promise<User[]>;

  ofId(id: string): Promise<User | null>;

  ofIds(ids: string[]): Promise<User[]>;

  ofStatus(status: UserStatus): Promise<User[]>;

  update(user: User): Promise<UpdateUserResponse>;

  delete(id: string): Promise<void>;

  deleteAll(): Promise<void>;

  blacklist(users: User[]): Promise<void>;

  isBlacklisted(email: string): Promise<boolean>;

  count(props: WhereProps): Promise<number>;

  addDevice(id: string, props: Device): Promise<void>;

  removeDevice(id: string): Promise<void>;
}
