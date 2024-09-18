import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { LearningObjective, MediaObject } from 'src/core/models';
import {
  LearningObjectiveRepository,
  OBJECTIVE_REPOSITORY,
} from 'src/core/ports/objective.repository';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class UploadObjectiveImageCommand {
  id: string;
  file: File;
}

@Injectable()
export class UploadObjectiveImageUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
  ) {}

  async execute(command: UploadObjectiveImageCommand) {
    const objective = await this.tryToFindObjective(command.id);
    const previousImage = await this.tryToFindTheImageOfObjective(objective);
    if (previousImage) {
      await this.deletePreviousObjectiveImage(previousImage);
    }

    const image = await this.upload(objective, command.file);

    return image;
  }

  private async tryToFindObjective(id: string): Promise<LearningObjective> {
    const instance = await this.objectiveRepository.ofId(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private tryToFindTheImageOfObjective(
    objective: LearningObjective,
  ): Promise<MediaObject | null> {
    return this.mediaObjectRepository.findOne(objective.id);
  }

  private async upload(
    objective: LearningObjective,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = MediaObject.generate(file, 'objective');
    await this.storageInterface.write(image.bucket, image.name, file);
    await this.mediaObjectRepository.saveObjectiveImage(objective, image);

    return image;
  }

  private async deletePreviousObjectiveImage(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.delete(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
