import { Injectable } from '@nestjs/common';
import { Edito } from 'src/core/models/edito.model';
import {
  CreateEditoCommand,
  EditoRepository,
  UpdateEditoCommand,
} from 'src/core/ports/edito.repository';

@Injectable()
export class InMemoryEditoRepository implements EditoRepository {
  #editos: Edito[] = [];

  get editos(): Edito[] {
    return this.#editos;
  }

  init(editos: Edito[]): void {
    this.#editos = editos;
  }

  reset(): void {
    this.#editos = [];
  }

  create(command: CreateEditoCommand): Promise<Edito> {
    const edito: Edito = {
      id: command.universityId,
      university: null,
      content: '',
      languageCode: '',
      translations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return Promise.resolve(edito);
  }

  async findAll(): Promise<Edito[]> {
    return Promise.resolve(this.#editos);
  }

  async findById(id: string): Promise<Edito> {
    return Promise.resolve(this.#editos[0]);
  }

  async update(command: UpdateEditoCommand): Promise<Edito> {
    return Promise.resolve(this.#editos[0]);
  }
}
