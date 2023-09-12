import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Campus } from 'src/core/models/campus.model';

export class CreateCampusRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCampusRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  name?: string;
}

export class CampusResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  @IsUUID()
  id: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @Expose({ groups: ['read'] })
  name?: string;

  constructor(partial: Partial<CampusResponse>) {
    Object.assign(this, partial);
  }

  static fromCampus(campus: Campus) {
    return new CampusResponse({
      id: campus.id,
      name: campus.name,
    });
  }
}
