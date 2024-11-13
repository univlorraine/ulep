import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomLogEntryRequest {
  @IsString()
  @IsNotEmpty()
  content: string;
}
