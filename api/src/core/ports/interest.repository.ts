import { Interest, InterestCategory } from '../models';

export const INTEREST_REPOSITORY = 'interest.repository';

export interface InterestRepository {
  createInterest(interest: Interest): Promise<Interest>;

  createCategory(category: InterestCategory): Promise<InterestCategory>;

  interestOfId(id: string): Promise<Interest | null>;

  categoryOfId(id: string): Promise<InterestCategory | null>;

  interestByCategories(): Promise<InterestCategory[]>;

  deleteInterest(instance: Interest): Promise<void>;

  deleteCategory(instance: InterestCategory): Promise<void>;
}
