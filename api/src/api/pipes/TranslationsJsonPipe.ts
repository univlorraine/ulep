import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TranslationsJsonPipe implements PipeTransform {
  transform(values?: string[]) {
    try {
      if (!values) {
        return [];
      }

      const result = values.map((value) => JSON.parse(value));
      return result;
    } catch (error) {
      throw new BadRequestException('Failed to parse JSON');
    }
  }
}
