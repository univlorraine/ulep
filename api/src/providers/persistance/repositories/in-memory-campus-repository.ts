import { Injectable } from '@nestjs/common';
import { Collection } from '@app/common';
import { CampusRepository } from 'src/core/ports/campus.repository';
import { Campus } from 'src/core/models/campus.model';

@Injectable()
export class InMemoryCampusRepository implements CampusRepository {
  #campus: Campus[] = [];

  get campis(): Campus[] {
    return this.#campus;
  }

  init(campus: Campus[]): void {
    this.#campus = campus;
  }

  reset(): void {
    this.#campus = [];
  }

  async all(): Promise<Collection<Campus>> {
    return {
      items: this.#campus,
      totalItems: this.#campus.length,
    };
  }

  async ofId(id: string): Promise<Campus> {
    return this.#campus.find((campus) => campus.id === id);
  }

  create(campus: Campus): Promise<Campus> {
    this.#campus.push(campus);
    return Promise.resolve(campus);
  }
  async update(udpatedCampus: Campus): Promise<Campus> {
    const index = this.#campus.findIndex(
      (camp) => camp.id === udpatedCampus.id,
    );

    if (index === -1) {
      return Promise.reject(null);
    }

    this.#campus[index] = udpatedCampus;

    return Promise.resolve(udpatedCampus);
  }

  delete(id: string): Promise<void> {
    const index = this.#campus.findIndex((campus) => campus.id === id);

    if (index !== -1) {
      this.#campus.splice(index, 1);
    }

    return Promise.resolve();
  }
}
