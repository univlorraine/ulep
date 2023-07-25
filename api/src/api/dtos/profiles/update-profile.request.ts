import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CEFRLevel } from 'src/core/models/cefr';
import { UpdateProfileCommand } from 'src/core/usecases/profiles/update-profile.usecase';

export class UpdateProfileRequest implements Omit<UpdateProfileCommand, 'id'> {
  @ApiProperty({ enum: CEFRLevel, example: 'B2' })
  @IsEnum(CEFRLevel)
  proficiencyLevel: CEFRLevel;
}
