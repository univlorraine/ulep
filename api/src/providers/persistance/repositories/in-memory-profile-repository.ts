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
import { ProfileWithLogEntries } from 'src/core/models/profileWithLogEntries.model';
import { Profile } from '../../../core/models/profile.model';
import { ProfileRepository } from '../../../core/ports/profile.repository';

export class InMemoryProfileRepository implements ProfileRepository {
  #profiles: Map<string, Profile> = new Map();
  #profilesWithLogEntries: Map<string, ProfileWithLogEntries> = new Map();

  init(profiles: Profile[]): void {
    this.#profiles = new Map(profiles.map((profile) => [profile.id, profile]));
    this.#profilesWithLogEntries = new Map();
  }

  reset(): void {
    this.#profiles = new Map();
  }

  async ofId(id: string): Promise<Profile> {
    return this.#profiles.get(id);
  }

  async ofIdWithTandemsProfiles(id: string): Promise<Profile> {
    return this.#profiles.get(id);
  }

  async ofUser(id: string): Promise<Profile> {
    for (const profile of this.#profiles.values()) {
      if (profile.user.id === id) {
        return profile;
      }
    }
  }

  async create(profile: Profile): Promise<void> {
    this.#profiles.set(profile.id, profile);
  }

  async update(profile: Profile): Promise<Profile> {
    if (this.#profiles.has(profile.id)) {
      this.#profiles.set(profile.id, profile);
    }

    return this.#profiles.get(profile.id);
  }

  async findAll(offset?: number, limit?: number): Promise<Collection<Profile>> {
    const allItems = Array.from(this.#profiles.values());

    return {
      items: allItems.slice(offset, offset + limit),
      totalItems: allItems.length,
    };
  }

  async findAllWithMasteredLanguageAndLearningLanguage(
    firstLanguageCode: string,
    secondLanguageCode: string,
  ): Promise<Profile[]> {
    return Array.from(this.#profiles.values()).filter(
      (profile) =>
        profile.masteredLanguages.some(
          (language) => language.code === firstLanguageCode,
        ) ||
        profile.learningLanguages.some(
          (language) => language.language.code === secondLanguageCode,
        ),
    );
  }

  async findAllWithTandemsProfiles(
    offset?: number,
    limit?: number,
  ): Promise<Collection<Profile>> {
    const allItems = Array.from(this.#profiles.values());

    return {
      items: allItems.slice(offset, offset + limit),
      totalItems: allItems.length,
    };
  }

  async delete(profile: Profile): Promise<void> {
    this.#profiles.delete(profile.id);
  }

  async findAllWithLogEntries(
    offset?: number,
    limit?: number,
  ): Promise<Collection<ProfileWithLogEntries>> {
    const allItems = Array.from(this.#profilesWithLogEntries.values());

    return {
      items: allItems.slice(offset, offset + limit),
      totalItems: allItems.length,
    };
  }

  async findByContactIdWithLogEntries(
    contactId: string,
  ): Promise<ProfileWithLogEntries> {
    return this.findAllWithLogEntries()[0];
  }

  async findByEmailWithLogEntries(
    email: string,
  ): Promise<ProfileWithLogEntries> {
    return this.findAllWithLogEntries()[0];
  }
}
