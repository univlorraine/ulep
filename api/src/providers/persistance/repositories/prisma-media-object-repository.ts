import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import {
  LearningLanguage,
  LearningObjective,
  MediaObject,
  News,
  University,
  User,
} from 'src/core/models';
import { Activity } from 'src/core/models/activity.model';
import { EventObject } from 'src/core/models/event.model';
import { Instance } from 'src/core/models/Instance.model';
import { MediaObjectRepository } from 'src/core/ports/media-object.repository';

@Injectable()
export class PrismaMediaObjectRepository implements MediaObjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async audioTranslatedOfVocabulary(
    vocabularyId: string,
    isTranslation: boolean,
  ): Promise<MediaObject | null> {
    let mediaObject: any;
    if (isTranslation) {
      mediaObject = await this.prisma.mediaObjects.findFirst({
        where: { PronunciationTranslation: { id: vocabularyId } },
      });
    } else {
      mediaObject = await this.prisma.mediaObjects.findFirst({
        where: { PronunciationWord: { id: vocabularyId } },
      });
    }

    if (!mediaObject) {
      return null;
    }

    return new MediaObject({
      id: mediaObject.id,
      name: mediaObject.name,
      bucket: mediaObject.bucket,
      mimetype: mediaObject.mime,
      size: mediaObject.size,
    });
  }

  async audioTranslatedOfVocabularyActivity(
    vocabularyId: string,
  ): Promise<MediaObject | null> {
    const mediaObject = await this.prisma.mediaObjects.findFirst({
      where: { ActivityVocabulary: { id: vocabularyId } },
    });

    if (!mediaObject) {
      return null;
    }

    return new MediaObject({
      id: mediaObject.id,
      name: mediaObject.name,
      bucket: mediaObject.bucket,
      mimetype: mediaObject.mime,
      size: mediaObject.size,
    });
  }

  async imageOfActivity(activityId: string): Promise<MediaObject | null> {
    const mediaObject = await this.prisma.mediaObjects.findFirst({
      where: { Activity: { id: activityId } },
    });

    if (!mediaObject) {
      return null;
    }

    return new MediaObject({
      id: mediaObject.id,
      name: mediaObject.name,
      bucket: mediaObject.bucket,
      mimetype: mediaObject.mime,
      size: mediaObject.size,
    });
  }

  async ressourceOfActivity(activityId: string): Promise<MediaObject | null> {
    const mediaObject = await this.prisma.mediaObjects.findFirst({
      where: { Activity: { id: activityId } },
    });

    if (!mediaObject) {
      return null;
    }

    return new MediaObject({
      id: mediaObject.id,
      name: mediaObject.name,
      bucket: mediaObject.bucket,
      mimetype: mediaObject.mime,
      size: mediaObject.size,
    });
  }

  async saveAudioVocabulary(
    vocabularyId: string,
    isTranslation: boolean,
    object: MediaObject,
  ): Promise<void> {
    const data: any = {
      id: object.id,
      name: object.name,
      bucket: object.bucket,
      mime: object.mimetype,
      size: object.size,
    };

    if (isTranslation) {
      await this.prisma.mediaObjects.create({
        data: {
          ...data,
          PronunciationTranslation: {
            connect: {
              id: vocabularyId,
            },
          },
        },
      });
    } else {
      await this.prisma.mediaObjects.create({
        data: {
          ...data,
          PronunciationWord: {
            connect: {
              id: vocabularyId,
            },
          },
        },
      });
    }
  }

  async saveAudioVocabularyActivity(
    vocabularyId: string,
    object: MediaObject,
  ): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        ActivityVocabulary: {
          connect: {
            id: vocabularyId,
          },
        },
      },
    });
  }

  async saveAvatar(user: User, object: MediaObject): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        User: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async saveImageOfActivity(
    activity: Activity,
    object: MediaObject,
  ): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        Activity: {
          connect: {
            id: activity.id,
          },
        },
      },
    });
  }

  async saveRessourceOfActivity(
    activity: Activity,
    object: MediaObject,
  ): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        ActivityRessourceFile: {
          connect: {
            id: activity.id,
          },
        },
      },
    });
  }

  async save(object: MediaObject): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
      },
    });
  }

  async saveObjectiveImage(
    objective: LearningObjective,
    object: MediaObject,
  ): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        Goal: {
          connect: {
            id: objective.id,
          },
        },
      },
    });
  }

  async saveUniversityImage(
    university: University,
    object: MediaObject,
  ): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        University: {
          connect: {
            id: university.id,
          },
        },
      },
    });
  }

  async saveInstanceDefaultCertificate(
    instance: Instance,
    object: MediaObject,
  ): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        InstanceDefaultCertificateFile: {
          connect: {
            id: instance.id,
          },
        },
      },
    });
  }

  async saveUniversityDefaultCertificate(
    university: University,
    object: MediaObject,
  ): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        UniversitiesDefaultCertificateFile: {
          connect: {
            id: university.id,
          },
        },
      },
    });
  }

  async saveNewsImage(news: News, object: MediaObject): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        News: {
          connect: {
            id: news.id,
          },
        },
      },
    });
  }

  async saveLearningLanguageCertificate(
    learningLanguage: LearningLanguage,
    object: MediaObject,
  ): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        LearningLanguageCertificateFile: {
          connect: {
            id: learningLanguage.id,
          },
        },
      },
    });
  }

  async saveEventImage(event: EventObject, object: MediaObject): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        Event: {
          connect: {
            id: event.id,
          },
        },
      },
    });
  }

  async avatarOfUser(userId: string): Promise<MediaObject | null> {
    // Get User or Administrator avatar
    const mediaObject = await this.prisma.mediaObjects.findFirst({
      where: {
        OR: [
          { User: { id: userId } },
          { id: userId },
        ],
      },
    });

    if (!mediaObject) {
      return null;
    }

    return new MediaObject({
      id: mediaObject.id,
      name: mediaObject.name,
      bucket: mediaObject.bucket,
      mimetype: mediaObject.mime,
      size: mediaObject.size,
    });
  }

  async findAll(): Promise<MediaObject[]> {
    const instances = await this.prisma.mediaObjects.findMany();

    return instances.map(
      (mediaObject) =>
        new MediaObject({
          id: mediaObject.id,
          name: mediaObject.name,
          bucket: mediaObject.bucket,
          mimetype: mediaObject.mime,
          size: mediaObject.size,
        }),
    );
  }

  async findOne(id: string): Promise<MediaObject | null> {
    const result = await this.prisma.mediaObjects.findUnique({ where: { id } });

    if (!result) {
      return null;
    }

    return new MediaObject({
      id: result.id,
      name: result.name,
      bucket: result.bucket,
      mimetype: result.mime,
      size: result.size,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.mediaObjects.delete({ where: { id } });
  }
}
