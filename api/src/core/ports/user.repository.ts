import { Collection } from 'src/shared/types/collection';
import { User } from '../models/user';

export interface UserRepository {
  all(offset?: number, limit?: number): Promise<Collection<User>>;

  ofId(id: string): Promise<User | null>;

  ofEmail(email: string): Promise<User | null>;

  save(user: User): Promise<void>;
}
