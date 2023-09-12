export abstract class ModelFactory<T> {
  abstract getDefaults(): Partial<T>;

  makeOne(overrides?: Partial<T>): T {
    const instance = {
      ...this.getDefaults(),
      ...overrides,
    } as T;

    return instance;
  }

  makeMany(count: number, overrides?: Partial<T>): T[] {
    const instances = [];

    for (let i = 0; i < count; i++) {
      const instance = this.makeOne(overrides);
      instances.push(instance);
    }

    return instances;
  }
}
