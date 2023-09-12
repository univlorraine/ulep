import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ReportStatus } from 'src/core/models/report.model';

export class ReportStatusesPipe implements PipeTransform<ReportStatus> {
  transform(value: string) {
    if (!value) {
      new BadRequestException('Status is required');
    }

    const enumValues = Object.keys(ReportStatus);

    if (!enumValues.includes(value)) {
      throw new BadRequestException(`Status must be one of ${enumValues}`);
    }

    return value as ReportStatus;
  }
}
