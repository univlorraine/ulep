/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
import { Edito } from 'src/core/models/edito.model';
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

  async saveEditoImage(edito: Edito, object: MediaObject): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        Edito: {
          connect: {
            id: edito.id,
          },
        },
      },
    });
  }

  async avatarOfUser(userId: string): Promise<MediaObject | null> {
    // Get User or Administrator avatar
    const mediaObject = await this.prisma.mediaObjects.findFirst({
      where: {
        OR: [{ User: { id: userId } }, { id: userId }],
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
