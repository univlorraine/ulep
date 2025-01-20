import { Inject, Injectable } from '@nestjs/common';
import {
  EditoRepository,
  EDITO_REPOSITORY,
} from 'src/core/ports/edito.repository';

@Injectable()
export class GetEditoUsecase {
  constructor(
    @Inject(EDITO_REPOSITORY)
    private readonly editoRepository: EditoRepository,
  ) {}

  async execute(id: string) {
    const edito = await this.editoRepository.findById(id);

    return edito;
  }
}
