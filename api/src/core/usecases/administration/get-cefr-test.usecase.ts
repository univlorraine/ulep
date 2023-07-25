import { Inject, Injectable } from '@nestjs/common';
import { DomainError } from 'src/core/errors/errors';
import { CEFRLevel } from 'src/core/models/cefr';
import { CEFRRepository } from 'src/core/ports/cefr.repository';
import { CEFR_REPOSITORY } from 'src/providers/providers.module';

export type GetCEFRTestCommand = {
  level: CEFRLevel;
};

@Injectable()
export class GetCEFRTestUsecase {
  constructor(
    @Inject(CEFR_REPOSITORY)
    private readonly cefrRepository: CEFRRepository,
  ) {}

  async execute(command: GetCEFRTestCommand) {
    if (command.level === CEFRLevel.A0) {
      throw new DomainError('Level A0 is not supported');
    }

    return this.cefrRepository.testOfLevel(command.level);
  }
}
