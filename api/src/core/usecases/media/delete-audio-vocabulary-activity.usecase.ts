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
import { ActivityVocabulary } from 'src/core/models/activity.model';
import { MediaObject } from 'src/core/models/media.model';
import {
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';
import {
  MediaObjectRepository,
  MEDIA_OBJECT_REPOSITORY,
} from 'src/core/ports/media-object.repository';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from '../../ports/storage.interface';

export class DeleteAudioVocabularyActivityCommand {
  vocabularyId: string;
}

@Injectable()
export class DeleteAudioVocabularyActivityUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
  ) {}

  async execute(command: DeleteAudioVocabularyActivityCommand) {
    const vocabulary = await this.tryToFindTheVocabularyOfId(
      command.vocabularyId,
    );

    if (vocabulary.pronunciationActivityVocabulary) {
      await this.deletePreviousSound(
        vocabulary.pronunciationActivityVocabulary,
      );
    }
  }

  private async tryToFindTheVocabularyOfId(
    id: string,
  ): Promise<ActivityVocabulary> {
    const vocabulary = await this.activityRepository.ofVocabularyId(id);
    if (!vocabulary) {
      throw new UnauthorizedOperation();
    }

    return vocabulary;
  }

  private async deletePreviousSound(sound: MediaObject | null) {
    if (!sound) return;
    if (await this.storageInterface.fileExists(sound.bucket, sound.name)) {
      await this.storageInterface.delete(sound.bucket, sound.name);
      await this.mediaObjectRepository.remove(sound.id);
    }
  }
}
