import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GameName, LogEntryType } from 'src/core/models/log-entry.model';

export class CreateCustomLogEntryRequest {
  // Custom Event
  @IsString()
  @IsOptional()
  content?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsString()
  @IsOptional()
  title?: string;

  // Visio Event
  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  partnerTandemId?: string;

  @IsString()
  @IsOptional()
  tandemFirstname?: string;

  @IsString()
  @IsOptional()
  tandemLastname?: string;

  // Game Event
  @IsNumber()
  @IsOptional()
  percentage?: number;

  @IsString()
  @IsOptional()
  gameName?: GameName;

  @IsString()
  @IsNotEmpty()
  type: LogEntryType;
}
