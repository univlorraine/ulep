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

import { Collection } from '@app/common';
import { Injectable } from '@nestjs/common';
import { HistorizedTandem } from 'src/core/models/historized-tandem.model';
import { Tandem, TandemStatus } from '../../../core/models';
import {
  FindWhereProps,
  TandemRepository,
} from '../../../core/ports/tandem.repository';

@Injectable()
export class InMemoryTandemRepository implements TandemRepository {
  #tandems: Tandem[] = [];

  init(tandems: Tandem[]): void {
    this.#tandems = tandems;
  }

  reset(): void {
    this.#tandems = [];
  }

  save(tandem: Tandem): Promise<void> {
    this.#tandems.push(tandem);

    return Promise.resolve();
  }

  saveMany(tandems: Tandem[]): Promise<void> {
    for (const tandem of tandems) {
      this.#tandems.push(tandem);
    }

    return Promise.resolve();
  }

  async findWhere(props: FindWhereProps): Promise<Collection<Tandem>> {
    const { status, offset, limit } = props;

    let tandems = this.#tandems;
    if (status) {
      tandems = tandems.filter((tandem) => tandem.status === status);
    }

    if (offset > tandems.length) {
      return { items: [], totalItems: tandems.length };
    }

    return {
      items: tandems.slice(offset, offset + limit),
      totalItems: tandems.length,
    };
  }

  async getExistingTandems(): Promise<Tandem[]> {
    return this.#tandems.filter(
      (tandem) => tandem.status !== TandemStatus.INACTIVE,
    );
  }

  async getTandemsForProfile(profileId: string): Promise<Tandem[]> {
    return this.#tandems.filter((tandem) =>
      tandem.learningLanguages.some(
        (learningLanguage) => learningLanguage.profile?.id === profileId,
      ),
    );
  }

  async getTandemForLearningLanguage(
    learningLanguageId: string,
  ): Promise<Tandem> {
    return this.#tandems.find((tandem) =>
      tandem.learningLanguages.some(
        (learningLanguage) => learningLanguage.id === learningLanguageId,
      ),
    );
  }

  async getTandemOfLearningLanguages(
    learningLanguageIds: string[],
  ): Promise<Tandem> {
    return this.#tandems.find((tandem) =>
      tandem.learningLanguages.every((learningLanguage) =>
        learningLanguageIds.includes(learningLanguage.id),
      ),
    );
  }

  async deleteTandemNotLinkedToLearningLangues(): Promise<number> {
    const length = this.#tandems.length;
    this.#tandems = this.#tandems.filter((tandem) => {
      return tandem.learningLanguages?.length > 0;
    });
    return Promise.resolve(length - this.#tandems.length);
  }

  async deleteTandemLinkedToLearningLanguages(
    learningLanguageIds: string[],
  ): Promise<number> {
    const length = this.#tandems.length;
    this.#tandems = this.#tandems.filter((tandem) =>
      tandem.learningLanguages.some((ll) =>
        learningLanguageIds.includes(ll.id),
      ),
    );
    return Promise.resolve(length - this.#tandems.length);
  }

  ofId(id: string): Promise<Tandem> {
    return Promise.resolve(this.#tandems.find((tandem) => tandem.id === id));
  }

  ofIds(ids: string[]): Promise<Tandem[]> {
    return Promise.resolve(
      this.#tandems.filter((tandem) => ids.includes(tandem.id)),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disableTandemsForUser(id: string): Promise<void> {
    return Promise.resolve();
  }

  update(tandem: Tandem): Promise<void> {
    this.#tandems = this.#tandems.map((t) => (t.id === tandem.id ? tandem : t));
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    this.#tandems = this.#tandems.filter((t) => t.id !== id);
    return Promise.resolve();
  }

  // TODO
  deleteAll(): Promise<void> {
    this.#tandems = [];

    return Promise.resolve();
  }

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  archiveTandems(tandems: Tandem[], purgeId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHistorizedTandemForUser(userId: string): Promise<HistorizedTandem[]> {
    throw new Error('Not implemented');
  }
}
