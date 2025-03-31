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
