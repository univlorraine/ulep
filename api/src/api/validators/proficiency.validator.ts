import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ProficiencyLevel } from 'src/core/models/proficiency.model';

export class ParseProficiencyLevelPipe
  implements PipeTransform<ProficiencyLevel>
{
  transform(value: string) {
    if (!value) {
      new BadRequestException('Level is required');
    }

    const enumValues = Object.keys(ProficiencyLevel);

    if (!enumValues.includes(value)) {
      throw new BadRequestException(`Level must be one of ${enumValues}`);
    }

    return value as ProficiencyLevel;
  }
}
