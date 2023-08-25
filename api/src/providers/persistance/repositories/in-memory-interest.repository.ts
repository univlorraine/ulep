import { Collection } from '@app/common';
import { Interest, InterestCategory } from 'src/core/models';
import { InterestRepository } from 'src/core/ports/interest.repository';

export class InMemoryInterestRepository implements InterestRepository {
  #categories: InterestCategory[] = [];

  get interests(): Interest[] {
    return this.#categories.reduce(
      (interests, category) => [...interests, ...(category.interests ?? [])],
      [],
    );
  }

  get categories(): InterestCategory[] {
    return this.#categories;
  }

  init(categories: InterestCategory[] = []): void {
    this.#categories = categories;
  }

  reset(): void {
    this.#categories = [];
  }

  async createInterest(
    interest: Interest,
    category: string,
  ): Promise<Interest> {
    const instance = await this.categoryOfId(category);

    if (!instance) {
      throw new Error('Interest category does not exist');
    }

    instance.interests = [...(instance.interests ?? []), interest];

    return interest;
  }

  createCategory(category: InterestCategory): Promise<InterestCategory> {
    this.#categories.push(category);

    return Promise.resolve(category);
  }

  async interestOfId(id: string): Promise<Interest> {
    const interest = this.interests.find((interest) => interest.id === id);

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

  async interestByCategories(): Promise<Collection<InterestCategory>> {
    return new Collection<InterestCategory>({
      items: this.#categories,
      totalItems: this.#categories.length,
    });
  }

  async deleteInterest(instance: Interest): Promise<void> {
    const category = this.#categories.find((category) =>
      category.interests.some((interest) => interest.id === instance.id),
    );

    if (!category) {
      return;
    }

    const index = category.interests.findIndex(
      (interest) => interest.id === instance.id,
    );

    if (index === -1) {
      return;
    }

    category.interests.splice(index, 1);
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

  categoryOfName(name: string): Promise<InterestCategory> {
    const category = this.#categories.find(
      (category) => category.name.content === name,
    );

    if (!category) {
      return null;
    }

    return Promise.resolve(category);
  }
  updateInterest(): Promise<Interest> {
    throw new Error('Method not implemented.');
  }
  updateInterestCategory(): Promise<InterestCategory> {
    throw new Error('Method not implemented.');
  }
}
