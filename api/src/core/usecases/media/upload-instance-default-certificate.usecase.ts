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
import { MediaObject } from 'src/core/models';
import { Instance } from 'src/core/models/Instance.model';
import {
  INSTANCE_REPOSITORY,
  InstanceRepository,
} from 'src/core/ports/instance.repository';
import { v4 } from 'uuid';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class UploadInstanceDefaultCertificateCommand {
  file: File;
}

@Injectable()
export class UploadInstanceDefaultCertificateUsecase {
  #name = 'certificates/instance/Modèle de certificat.pdf';
  #bucket = 'assets';

  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(INSTANCE_REPOSITORY)
    private readonly instanceRepository: InstanceRepository,
  ) {}

  async execute(command: UploadInstanceDefaultCertificateCommand) {
    const instance = await this.instanceRepository.getInstance();
    const previousFile = await this.tryToFindTheFile(instance);

    await this.deletePreviousFile(previousFile);

    return this.upload(instance, command.file);
  }

  private tryToFindTheFile(instance: Instance): Promise<MediaObject | null> {
    return instance.defaultCertificateFile?.id
      ? this.mediaObjectRepository.findOne(instance.defaultCertificateFile.id)
      : null;
  }

  private async upload(
    instance: Instance,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const mediaObject = new MediaObject({
      id: v4(),
      name: this.#name,
      bucket: this.#bucket,
      mimetype: file.mimetype,
      size: file.size,
    });
    await this.storage.write(mediaObject.bucket, mediaObject.name, file);
    await this.mediaObjectRepository.saveInstanceDefaultCertificate(
      instance,
      mediaObject,
    );

    return mediaObject;
  }

  private async deletePreviousFile(mediaObject: MediaObject | null) {
    await this.storage.delete(this.#bucket, this.#name);
    if (!mediaObject) return;
    await this.mediaObjectRepository.remove(mediaObject.id);
  }
}
