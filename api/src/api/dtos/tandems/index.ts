import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsDate } from 'class-validator';
import { IsAfterThan } from 'src/api/validators/dates.validator';
import { Tandem } from 'src/core/models/tandem';

export class CreateTandemRequest {
  @ApiProperty({
    type: 'string',
    isArray: true,
    description: 'List of profile ids',
  })
  @ArrayNotEmpty()
  profiles: string[];

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  @IsAfterThan('startDate')
  endDate: Date;
}

export class UpdateTandemRequest extends PartialType(CreateTandemRequest) {}

export class TandemResponse {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    isArray: true,
  })
  @Expose({ groups: ['read'] })
  profiles: string[];

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Expose({ groups: ['read'] })
  startDate: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Expose({ groups: ['read'] })
  endDate: Date;

  constructor(partial: Partial<TandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(tandem: Tandem): TandemResponse {
    return new TandemResponse({
      id: tandem.id,
      profiles: tandem.profiles.map((profile) => profile.id),
      startDate: tandem.startDate,
      endDate: tandem.endDate,
    });
  }
}
