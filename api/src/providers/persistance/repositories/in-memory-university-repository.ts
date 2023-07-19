import { Language } from 'src/core/models/language';
import { University } from '../../../core/models/university';
import { UniversityRepository } from '../../../core/ports/university.repository';
import { Injectable } from '@nestjs/common';

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

  async ofId(id: string): Promise<University> {
    return this.#universities.find((university) => university.id === id);
  }

  async ofName(name: string): Promise<University> {
    return this.#universities.find((university) => university.name === name);
  }

  async addLanguage(language: Language, university: University): Promise<void> {
    const index = this.#universities.findIndex((u) => u.id === university.id);

    if (index !== -1) {
      const university = this.#universities[index];
      university.languages = [...university.languages, language];
    }
  }

  async removeLanguage(code: string, university: University): Promise<void> {
    const index = this.#universities.findIndex((u) => u.id === university.id);

    if (index !== -1) {
      this.#universities[index].languages = this.#universities[
        index
      ].languages.filter((l) => l.code !== code);
    }
  }

  async create(university: University): Promise<void> {
    this.#universities.push(university);
  }

  async delete(university: University): Promise<void> {
    const index = this.#universities.findIndex((u) => u.id === university.id);

    if (index !== -1) {
      this.#universities.splice(index, 1);
    }
  }

  async findAll(offset?: number, limit?: number) {
    return {
      items: this.#universities.slice(offset, offset + limit),
      totalItems: this.#universities.length,
    };
  }
}
