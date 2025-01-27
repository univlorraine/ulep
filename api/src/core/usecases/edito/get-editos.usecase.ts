import { Inject, Injectable } from '@nestjs/common';
import {
  EditoRepository,
  EDITO_REPOSITORY,
} from 'src/core/ports/edito.repository';

@Injectable()
export class GetEditosUsecase {
  constructor(
    @Inject(EDITO_REPOSITORY)
    private readonly editoRepository: EditoRepository,
  ) {}

  async execute() {
    const editos = await this.editoRepository.findAll();

    return editos;
  }
}
