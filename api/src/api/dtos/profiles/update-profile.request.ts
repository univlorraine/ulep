import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Goal, MeetingFrequency } from 'src/core/models/profile';

export class UpdateProfileRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  university?: string;

  @ApiPropertyOptional({ enum: Goal, isArray: true })
  @IsOptional()
  @IsEnum(Goal, { each: true })
  goals?: Goal[];

  @ApiPropertyOptional({ enum: MeetingFrequency })
  @IsOptional()
  @IsEnum(MeetingFrequency)
  meetingFrequency?: MeetingFrequency;

  @ApiPropertyOptional()
  @IsOptional()
  bios?: string;
}
