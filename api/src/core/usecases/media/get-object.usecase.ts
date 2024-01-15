import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import { MediaObject } from 'src/core/models';

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

    if (!instance) {
      throw new NotFoundException();
    }

    return instance;
  }
}
