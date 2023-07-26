import { BadRequestException, PipeTransform } from '@nestjs/common';
import { CEFRLevel } from 'src/core/models/cefr';

export class LevelPipe implements PipeTransform<CEFRLevel> {
  transform(value: string) {
    if (!value) {
      new BadRequestException('Level is required');
    }

    const enumValues = Object.keys(CEFRLevel);

    if (!enumValues.includes(value)) {
      throw new BadRequestException(`Level must be one of ${enumValues}`);
    }

    return value as CEFRLevel;
  }
}
