import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateLanguageCommand } from 'src/core/usecases/languages/create-language.usecase';
import { UpdateLanguageCommand } from 'src/core/usecases/languages/update-language.usecase';

export class CreateLanguageRequest implements CreateLanguageCommand {
  @ApiProperty({ type: 'string', example: 'French' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'ISO 639-1 code',
    example: 'FR',
    uniqueItems: true,
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdateLanguageRequest
  implements Omit<UpdateLanguageCommand, 'code'>
{
  @ApiProperty({ type: 'string', example: 'French' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
