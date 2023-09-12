import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
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
    if (!tandem) {
      throw new RessourceDoesNotExist();
    }

    return tandem;
  }
}
