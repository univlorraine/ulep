import { Collection, SortOrder } from '@app/common';
import { Interest, InterestCategory } from '../models';

export const INTEREST_REPOSITORY = 'interest.repository';

export interface InterestRepository {
  createInterest(interest: Interest, category: string): Promise<Interest>;

  createCategory(category: InterestCategory): Promise<InterestCategory>;

  interestOfId(id: string): Promise<Interest | null>;

  categoryOfId(id: string): Promise<InterestCategory | null>;

  categoryOfName(name: string): Promise<InterestCategory | null>;

  interestByCategories(
    offset?: number,
    limit?: number,
    order?: SortOrder,
  ): Promise<Collection<InterestCategory>>;

  deleteInterest(instance: Interest): Promise<void>;

  deleteCategory(instance: InterestCategory): Promise<void>;

  updateInterest(interest: Interest): Promise<Interest>;

  updateInterestCategory(category: InterestCategory): Promise<InterestCategory>;
}
