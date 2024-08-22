import { Inject, Injectable } from '@nestjs/common';
import { MediaObject } from 'src/core/models';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';

export class GetMediaObjectCommand {
  id: string;
}

@Injectable()
export class GetMediaObjectUsecase {
  constructor(
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
  ) {}

  async execute(command: GetMediaObjectCommand): Promise<MediaObject> {
    const instance = await this.mediaObjectRepository.findOne(command.id);

    return instance;
  }
}
