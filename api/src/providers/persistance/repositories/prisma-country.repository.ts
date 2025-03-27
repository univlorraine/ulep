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

import { Injectable, Logger } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import {
  CountryFilters,
  CountryRepository,
} from 'src/core/ports/country.repository';
import { CountryCode, CountryWithUniversities } from 'src/core/models';
import { countryWithUniversitiesMapper } from 'src/providers/persistance/mappers/country.mapper';
import { UniversityRelations } from 'src/providers/persistance/mappers';

@Injectable()
export class PrismaCountryCodeRepository implements CountryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(PrismaCountryCodeRepository.name);

  async all(filters: CountryFilters): Promise<Collection<CountryCode>> {
    const count = await this.prisma.countryCodes.count({
      where: {
        enable: filters.where?.enable,
      },
    });

    let offset: number | undefined;
    let limit: number | undefined;

    if (filters.pagination) {
      limit = filters.pagination.limit;
      const page = filters.pagination.page;
      offset = page > 0 ? (page - 1) * limit : 0;
    }

    if (offset && offset >= count) {
      return { items: [], totalItems: count };
    }

    const countries = await this.prisma.countryCodes.findMany({
      where: {
        enable: filters.where?.enable,
      },
      orderBy: {
        name: filters.orderBy?.name,
      },
      skip: offset,
      take: limit,
    });

    return {
      items: countries,
      totalItems: count,
    };
  }

  async allWithUniversities(): Promise<CountryWithUniversities[]> {
    const countries = await this.prisma.countryCodes.findMany({
      where: {
        Organization: { some: {} },
      },
      include: { Organization: { include: UniversityRelations } },
    });

    return countries.map((country) => countryWithUniversitiesMapper(country));
  }

  async ofId(id: string): Promise<CountryCode> {
    const country = await this.prisma.countryCodes.findUnique({
      where: { id },
    });

    if (!country) {
      return null;
    }

    return country;
  }

  async ofCode(code: string): Promise<CountryCode | null> {
    const country = await this.prisma.countryCodes.findUnique({
      where: { code },
    });

    if (!country) {
      return null;
    }

    return country;
  }

  async toogleStatus(id: string, enable: boolean): Promise<void> {
    await this.prisma.countryCodes.update({
      where: { id },
      data: { enable },
    });
  }
}
