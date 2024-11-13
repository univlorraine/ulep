import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCustomLogEntryRequest {
  @IsString()
  @IsNotEmpty()
  content: string;
}
