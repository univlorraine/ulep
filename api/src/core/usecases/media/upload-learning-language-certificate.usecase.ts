import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { LearningLanguage, MediaObject } from 'src/core/models';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import { v4 } from 'uuid';
import {
  MediaObjectRepository,
  MEDIA_OBJECT_REPOSITORY,
} from '../../ports/media-object.repository';
import {
  File,
  StorageInterface,
  STORAGE_INTERFACE,
} from '../../ports/storage.interface';

export class UploadLearningLanguageCertificateCommand {
  id: string;
  file: File;
  language: string;
}

@Injectable()
export class UploadLearningLanguageCertificateUsecase {
  #name = '{userId}/Certificat - {language} - {name}.pdf';
  #bucket = 'certificates';

  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(
    command: UploadLearningLanguageCertificateCommand,
  ): Promise<MediaObject> {
    const learningLanguage = await this.tryToFindLearningLanguage(command.id);
    const previousFile = await this.tryToFindTheFile(learningLanguage);

    await this.deletePreviousFile(
      learningLanguage,
      previousFile,
      command.language,
    );

    return this.upload(learningLanguage, command.file, command.language);
  }

  private getFileName(learningLanguage: LearningLanguage, language: string) {
    const name = `${learningLanguage.profile.user.firstname} ${learningLanguage.profile.user.lastname}`;
    const userId = learningLanguage.profile.user.id;
    return this.#name
      .replace('{userId}', userId)
      .replace('{language}', language)
      .replace('{name}', name);
  }

  private async tryToFindLearningLanguage(
    id: string,
  ): Promise<LearningLanguage> {
    const learningLanguage = await this.learningLanguageRepository.ofId(id);
    if (!learningLanguage) {
      throw new UnauthorizedOperation();
    }

    return learningLanguage;
  }

  private tryToFindTheFile(
    learningLanguage: LearningLanguage,
  ): Promise<MediaObject | null> {
    return learningLanguage.certificateFile?.id
      ? this.mediaObjectRepository.findOne(learningLanguage.certificateFile.id)
      : null;
  }

  private async upload(
    learningLanguage: LearningLanguage,
    file: Express.Multer.File,
    language: string,
  ): Promise<MediaObject> {
    const mediaObject = new MediaObject({
      id: v4(),
      name: this.getFileName(learningLanguage, language),
      bucket: this.#bucket,
      mimetype: file.mimetype,
      size: file.size,
    });
    await this.storage.write(mediaObject.bucket, mediaObject.name, file);
    await this.mediaObjectRepository.saveLearningLanguageCertificate(
      learningLanguage,
      mediaObject,
    );

    return mediaObject;
  }

  private async deletePreviousFile(
    learningLanguage: LearningLanguage,
    mediaObject: MediaObject | null,
    language: string,
  ) {
    await this.storage.delete(
      this.#bucket,
      this.getFileName(learningLanguage, language),
    );
    if (!mediaObject) return;
    await this.mediaObjectRepository.remove(mediaObject.id);
  }
}
