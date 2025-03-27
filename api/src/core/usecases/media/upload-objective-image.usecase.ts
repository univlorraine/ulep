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
    private readonly storage: StorageInterface,
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
    return objective.image?.id
      ? this.mediaObjectRepository.findOne(objective.image.id)
      : null;
  }

  private async upload(
    objective: LearningObjective,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = MediaObject.generate(file, 'objective');
    await this.storage.write(image.bucket, image.name, file);
    await this.mediaObjectRepository.saveObjectiveImage(objective, image);

    return image;
  }

  private async deletePreviousObjectiveImage(image: MediaObject | null) {
    if (!image) return;
    await this.storage.delete(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
