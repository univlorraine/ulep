import { Interest, InterestCategory } from 'src/core/models';
import { InterestRepository } from 'src/core/ports/interest.repository';

export class InMemoryInterestRepository implements InterestRepository {
  #categories: InterestCategory[] = [];
  #interests: Interest[] = [];

  get interests(): Interest[] {
    return this.#interests;
  }

  get categories(): InterestCategory[] {
    return this.#categories;
  }

  init(interests: Interest[] = [], categories: InterestCategory[] = []): void {
    this.#interests = interests;
    this.#categories = categories;
  }

  reset(): void {
    this.#interests = [];
    this.#categories = [];
  }

  createInterest(interest: Interest): Promise<Interest> {
    this.#interests.push(interest);

    return Promise.resolve(interest);
  }

  createCategory(category: InterestCategory): Promise<InterestCategory> {
    this.#categories.push(category);

    return Promise.resolve(category);
  }

  async interestOfId(id: string): Promise<Interest> {
    const interest = this.#interests.find((interest) => interest.id === id);

    if (!interest) {
      return null;
    }

    return interest;
  }

  async categoryOfId(id: string): Promise<InterestCategory> {
    const category = this.#categories.find((category) => category.id === id);

    if (!category) {
      return null;
    }

    return category;
  }

  async interestByCategories(): Promise<InterestCategory[]> {
    return this.#categories;
  }

  async deleteInterest(instance: Interest): Promise<void> {
    const index = this.#interests.findIndex(
      (interest) => interest.id === instance.id,
    );

    if (index === -1) {
      return;
    }

    this.#interests.splice(index, 1);
  }

  async deleteCategory(instance: InterestCategory): Promise<void> {
    const index = this.#categories.findIndex(
      (category) => category.id === instance.id,
    );

    if (index === -1) {
      return;
    }

    this.#categories.splice(index, 1);
  }
}
