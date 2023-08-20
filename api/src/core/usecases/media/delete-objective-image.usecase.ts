import { Inject, Injectable } from '@nestjs/common';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';
import { LearningObjective, MediaObject } from 'src/core/models';
import { UnauthorizedOperation } from 'src/core/errors';
import {
  LearningObjectiveRepository,
  OBJECTIVE_REPOSITORY,
} from 'src/core/ports/objective.repository';

export class DeleteObjectiveImageCommand {
  id: string;
}

@Injectable()
export class DeleteObjectiveImageUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
  ) {}

  async execute(command: DeleteObjectiveImageCommand) {
    const objective = await this.tryToFindObjective(command.id);
    await this.deleteObjectiveImage(objective.image);
  }

  private async tryToFindObjective(id: string): Promise<LearningObjective> {
    const instance = await this.objectiveRepository.ofId(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private async deleteObjectiveImage(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.deleteFile(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
