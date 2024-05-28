import { Inject, Injectable } from '@nestjs/common';
import {
    MEDIA_OBJECT_REPOSITORY,
    MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
    File,
    STORAGE_INTERFACE,
    StorageInterface,
} from '../../ports/storage.interface';
import { MediaObject } from 'src/core/models/media.model';

export class UploadMediaCommand {
    conversationId: string;
    messageId: string;
    file: File;
}

@Injectable()
export class UploadMediaUsecase {
    constructor(
        @Inject(STORAGE_INTERFACE)
        private readonly storageInterface: StorageInterface,
        @Inject(MEDIA_OBJECT_REPOSITORY)
        private readonly mediaObjectRepository: MediaObjectRepository,
    ) {}

    async execute(command: UploadMediaCommand) {
        const avatar = await this.upload(command.file, command.conversationId);

        return avatar;
    }

    private async upload(
        file: Express.Multer.File,
        conversationId: string,
    ): Promise<MediaObject> {
        const image = MediaObject.image(file, `chat/${conversationId}`);
        await this.storageInterface.write(image.bucket, image.name, file);
        await this.mediaObjectRepository.saveFile(image);

        return image;
    }
}
