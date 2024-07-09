import { Injectable } from '@nestjs/common';
import { UuidProviderInterface } from 'src/core/ports/uuid.provider';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UuidProvider implements UuidProviderInterface {
  generate(): string {
    return uuidv4();
  }
}
