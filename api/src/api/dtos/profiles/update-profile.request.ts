import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { CEFRLevel } from 'src/core/models/profile';
import { UpdateProfileCommand } from 'src/core/usecases/profiles/update-profile.usecase';

export class UpdateProfileRequest implements Omit<UpdateProfileCommand, 'id'> {
  @ApiProperty({ type: 'string', example: 'B2' })
  @IsIn(['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  proficiencyLevel: CEFRLevel;
}
