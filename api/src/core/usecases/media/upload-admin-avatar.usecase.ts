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

import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { MediaObject } from 'src/core/models/media.model';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from 'src/core/ports/media-object.repository';
import {
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class UploadAdminAvatarCommand {
  userId: string;
  file: File;
}

@Injectable()
export class UploadAdminAvatarUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(command: UploadAdminAvatarCommand) {
    const user = await this.tryToFindTheUserOfId(command.userId);

    const previousImage = await this.tryToFindTheAvatarOfUser(user);

    await this.deletePreviousAvatar(previousImage);

    return this.upload(user, command.file);
  }

  private async upload(
    user: UserRepresentation,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = new MediaObject({
      id: user.id,
      name: MediaObject.getFileName(user.id, file.mimetype),
      bucket: MediaObject.getDefaultBucket(),
      mimetype: file.mimetype,
      size: file.size,
    });

    await this.storageInterface.write(image.bucket, image.name, file);
    await this.mediaObjectRepository.save(image);

    return image;
  }

  private async tryToFindTheUserOfId(id: string): Promise<UserRepresentation> {
    const instance = await this.keycloakClient.getUserById(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private tryToFindTheAvatarOfUser(
    user: UserRepresentation,
  ): Promise<MediaObject | null> {
    return this.mediaObjectRepository.findOne(user.id);
  }

  private async deletePreviousAvatar(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.delete(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
