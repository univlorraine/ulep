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

import { Injectable } from '@nestjs/common';
import {
  CountryFilters,
  CountryRepository,
} from '../../../core/ports/country.repository';
import {
  CountryCode,
  CountryWithUniversities,
} from 'src/core/models/country-code.model';
import { Collection } from '@app/common';

@Injectable()
export class InMemoryCountryCodesRepository implements CountryRepository {
  #countries: CountryCode[] = [];

  get countries(): CountryCode[] {
    return this.#countries;
  }

  init(countries: CountryCode[]): void {
    this.#countries = countries;
  }

  reset(): void {
    this.#countries = [];
  }

  async all(filters: CountryFilters): Promise<Collection<CountryCode>> {
    let countries = this.#countries;

    if (filters.where?.enable) {
      countries = countries.filter(
        (country) => country.enable === filters.where.enable,
      );
    }

    if (!filters.pagination) {
      return { items: countries, totalItems: countries.length };
    }

    const { page, limit } = filters.pagination;

    const offset = page > 0 ? (page - 1) * limit : 0;
    if (offset >= countries.length) {
      return { items: [], totalItems: countries.length };
    }

    countries = countries.sort((a, b) => {
      if (filters.orderBy?.name === 'asc') {
        return a.name.localeCompare(b.name);
      }

      if (filters.orderBy?.name === 'desc') {
        return b.name.localeCompare(a.name);
      }

      return 0;
    });

    return {
      items: countries.slice(offset, offset + limit),
      totalItems: countries.length,
    };
  }

  async allWithUniversities(): Promise<CountryWithUniversities[]> {
    //TODO: update this later for tests
    return [];
  }

  async ofId(id: string): Promise<CountryCode> {
    return this.#countries.find((country) => country.id === id);
  }

  async ofCode(code: string): Promise<CountryCode | null> {
    return this.#countries.find((country) => country.code === code);
  }

  async toogleStatus(id: string, enable: boolean): Promise<void> {
    const country = this.#countries.find((country) => country.id === id);

    if (!country) {
      return;
    }

    country.enable = enable;
  }
}
