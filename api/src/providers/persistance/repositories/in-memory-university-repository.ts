import { Collection } from '@app/common';
import { Injectable } from '@nestjs/common';
import { University } from 'src/core/models/university.model';
import {
  UniversityRepository,
  UpdateUniversityResponse,
} from 'src/core/ports/university.repository';

@Injectable()
export class InMemoryUniversityRepository implements UniversityRepository {
  #universities: University[] = [];

  get universities(): University[] {
    return this.#universities;
  }

  init(universities: University[]): void {
    this.#universities = universities;
  }

  reset(): void {
    this.#universities = [];
  }

  async create(university: University): Promise<University> {
    this.#universities.push(university);

    return university;
  }

  async findAll(): Promise<Collection<University>> {
    return new Collection<University>({
      items: this.#universities,
      totalItems: this.#universities.length,
    });
  }

  async findUniversityCentral(): Promise<University> {
    return this.#universities.find((university) => !university.parent);
  }

  async havePartners(id: string): Promise<boolean> {
    return this.#universities.some((university) => university.parent === id);
  }

  async ofId(id: string): Promise<University> {
    return this.#universities.find((university) => university.id === id);
  }

  async ofName(name: string): Promise<University> {
    return this.#universities.find((university) => university.name === name);
  }

  async update(university: University): Promise<UpdateUniversityResponse> {
    const index = this.#universities.findIndex((u) => u.id === university.id);

    if (index !== -1) {
      const university = this.#universities[index];
      this.#universities[index] = university;
    }
    return { university, usersId: [] };
  }

  async remove(id: string): Promise<void> {
    const index = this.#universities.findIndex((u) => u.id === id);

    if (index !== -1) {
      this.#universities.splice(index, 1);
    }
  }
}
