import { Injectable } from '@nestjs/common';
import { Language } from 'src/core/models/language.model';
import { University } from 'src/core/models/university.model';
import { UniversityRepository } from 'src/core/ports/university.repository';

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

  async findAll(): Promise<University[]> {
    return this.#universities;
  }

  async findUniversityCentral(): Promise<University> {
    return this.#universities.find((university) => !university.parent);
  }

  async findPartners(): Promise<University[]> {
    return this.#universities.filter((university) => !!university.parent);
  }

  async ofId(id: string): Promise<University> {
    return this.#universities.find((university) => university.id === id);
  }

  async ofName(name: string): Promise<University> {
    return this.#universities.find((university) => university.name === name);
  }

  async languages(id: string): Promise<Language[]> {
    const university = await this.ofId(id);

    return university?.languages || [];
  }

  async addLanguage(language: Language, university: University): Promise<void> {
    const index = this.#universities.findIndex((u) => u.id === university.id);

    if (index !== -1) {
      const university = this.#universities[index];
      university.languages = [...university.languages, language];
    }
  }

  async removeLanguage(
    language: Language,
    university: University,
  ): Promise<void> {
    const index = this.#universities.findIndex((u) => u.id === university.id);

    if (index !== -1) {
      this.#universities[index].languages = this.#universities[
        index
      ].languages.filter((l) => l.code !== language.code);
    }
  }

  async update(id: string, name: string): Promise<void> {
    const index = this.#universities.findIndex((u) => u.id === id);

    if (index !== -1) {
      this.#universities[index].name = name;
    }
  }

  async remove(id: string): Promise<void> {
    const index = this.#universities.findIndex((u) => u.id === id);

    if (index !== -1) {
      this.#universities.splice(index, 1);
    }
  }
}
