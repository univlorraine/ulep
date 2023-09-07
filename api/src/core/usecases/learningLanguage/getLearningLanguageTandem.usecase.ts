import { Inject, Injectable } from '@nestjs/common';
import { Tandem } from 'src/core/models';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';

interface GetLearningLanguageTandemQuery {
  id: string;
}

@Injectable()
export class GetLearningLanguageTandemUsecase {
  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
  ) {}

  async execute(query: GetLearningLanguageTandemQuery): Promise<Tandem> {
    const tandem = await this.tandemRepository.getTandemForLearningLanguage(
      query.id,
    );

    return tandem;
  }
}
