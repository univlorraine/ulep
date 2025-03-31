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
import { Vocabulary } from 'src/core/models/vocabulary.model';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from 'src/core/ports/media-object.repository';
import {
  VOCABULARY_REPOSITORY,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class DeleteAudioVocabularyCommand {
  vocabularyId: string;
  isTranslation: boolean;
}

@Injectable()
export class DeleteAudioVocabularyUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
  ) {}

  async execute(command: DeleteAudioVocabularyCommand) {
    const vocabulary = await this.tryToFindTheVocabularyOfId(
      command.vocabularyId,
    );

    const name = `${vocabulary.id}-${
      command.isTranslation ? 'translation' : 'word'
    }`;
    if (await this.storageInterface.fileExists('vocabulary', `${name}.wav`)) {
      await this.storageInterface.delete('vocabulary', `${name}.wav`);
      await this.mediaObjectRepository.remove(name);
    }
  }

  private async tryToFindTheVocabularyOfId(id: string): Promise<Vocabulary> {
    const vocabulary = await this.vocabularyRepository.findVocabularyById(id);
    if (!vocabulary) {
      throw new UnauthorizedOperation();
    }

    return vocabulary;
  }
}
