import { Injectable } from '@nestjs/common';
import { ProficiencyLevel } from 'src/core/models';

@Injectable()
export class GetLevelsUsecase {
  execute(): ProficiencyLevel[] {
    return Object.values(ProficiencyLevel);
  }
}
