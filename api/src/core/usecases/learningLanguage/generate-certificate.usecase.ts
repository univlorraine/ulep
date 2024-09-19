import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import { File as FileType } from '../../ports/storage.interface';

export class GenerateCertificateCommand {
  learningJournal?: boolean;
  consultingInterview?: boolean;
  sharedCertificate?: boolean;
}

@Injectable()
export class GenerateCertificateUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(id: string): Promise<FileType> {
    const learningLanguage = await this.learningLanguageRepository.ofId(id);

    if (!learningLanguage) {
      throw new RessourceDoesNotExist();
    }

    const certificateModel =
      learningLanguage.profile.user.university.defaultCertificateFile;

    const readableStream = await this.storage.read(
      certificateModel.bucket,
      certificateModel.name,
    );

    const fileBuffer = await this.streamToBuffer(readableStream);
    const fileName = `certificate_${learningLanguage.id}.pdf`;
    const file = {
      fieldname: '',
      originalname: fileName,
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: fileBuffer,
      size: fileBuffer.length,
    } as FileType;

    return file;
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
