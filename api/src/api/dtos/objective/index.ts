import * as Swagger from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsUUID, Length } from 'class-validator';
import { CreateObjectiveCommand } from '../../../core/usecases';
import { LearningObjective } from 'src/core/models';

export class CreateObjectiveRequest implements CreateObjectiveCommand {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  // TODO: get the language code from the request headers
  @Swagger.ApiProperty({ type: 'string' })
  @Transform(({ value }) => value?.toLowerCase())
  @IsString()
  @Length(2, 2)
  languageCode: string;
}

export class ObjectiveResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<ObjectiveResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: LearningObjective) {
    return new ObjectiveResponse({
      id: instance.id,
      name: instance.name.content,
    });
  }
}
