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
import { Interest, InterestCategory } from 'src/core/models';
import { InterestRepository } from 'src/core/ports/interest.repository';

export class InMemoryInterestRepository implements InterestRepository {
  #categories: InterestCategory[] = [];

  get interests(): Interest[] {
    return this.#categories.reduce(
      (interests, category) => [...interests, ...(category.interests ?? [])],
      [],
    );
  }

  get categories(): InterestCategory[] {
    return this.#categories;
  }

  init(categories: InterestCategory[] = []): void {
    this.#categories = categories;
  }

  reset(): void {
    this.#categories = [];
  }

  async createInterest(
    interest: Interest,
    category: string,
  ): Promise<Interest> {
    const instance = await this.categoryOfId(category);

    if (!instance) {
      throw new Error('Interest category does not exist');
    }

    instance.interests = [...(instance.interests ?? []), interest];

    return interest;
  }

  createCategory(category: InterestCategory): Promise<InterestCategory> {
    this.#categories.push(category);

    return Promise.resolve(category);
  }

  async interestOfId(id: string): Promise<Interest> {
    const interest = this.interests.find((interest) => interest.id === id);

    if (!interest) {
      return null;
    }

    return interest;
  }

  async categoryOfId(id: string): Promise<InterestCategory> {
    const category = this.#categories.find((category) => category.id === id);

    if (!category) {
      return null;
    }

    return category;
  }

  async interestByCategories(): Promise<Collection<InterestCategory>> {
    return new Collection<InterestCategory>({
      items: this.#categories,
      totalItems: this.#categories.length,
    });
  }

  async deleteInterest(instance: Interest): Promise<void> {
    const category = this.#categories.find((category) =>
      category.interests.some((interest) => interest.id === instance.id),
    );

    if (!category) {
      return;
    }

    const index = category.interests.findIndex(
      (interest) => interest.id === instance.id,
    );

    if (index === -1) {
      return;
    }

    category.interests.splice(index, 1);
  }

  async deleteCategory(instance: InterestCategory): Promise<void> {
    const index = this.#categories.findIndex(
      (category) => category.id === instance.id,
    );

    if (index === -1) {
      return;
    }

    this.#categories.splice(index, 1);
  }

  categoryOfName(name: string): Promise<InterestCategory> {
    const category = this.#categories.find(
      (category) => category.name.content === name,
    );

    if (!category) {
      return null;
    }

    return Promise.resolve(category);
  }
  updateInterest(): Promise<Interest> {
    throw new Error('Method not implemented.');
  }
  updateInterestCategory(): Promise<InterestCategory> {
    throw new Error('Method not implemented.');
  }
}
