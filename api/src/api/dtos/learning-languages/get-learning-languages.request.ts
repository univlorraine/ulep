import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../pagination';
import { IsUUID } from 'class-validator';

export class GetLearningLanguagesRequest extends PaginationDto {
  @ApiProperty({ type: 'string', isArray: true })
  @IsUUID('4', { each: true })
  universityIds: string[];
}
