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
import { Collection, PrismaService, SortOrder } from '@app/common';
import {
  GetUniversitiesCommand,
  UniversityRepository,
  UpdateUniversityResponse,
} from 'src/core/ports/university.repository';
import {
  UniversityRelations,
  universityMapper,
} from '../mappers/university.mapper';
import { University } from 'src/core/models';

@Injectable()
export class PrismaUniversityRepository implements UniversityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(university: University): Promise<University> {
    await this.prisma.organizations.create({
      data: {
        id: university.id,
        name: university.name,
        Parent: university.parent
          ? { connect: { id: university.parent } }
          : undefined,
        Country: {
          connect: { id: university.country.id },
        },
        Places: {
          create: university.campus.map((campus) => ({
            id: campus.id,
            name: campus.name,
          })),
        },
        SpecificLanguagesAvailable: {
          connect: university.specificLanguagesAvailable.map((language) => ({
            id: language.id,
          })),
        },
        NativeLanguage: {
          connect: { id: university.nativeLanguage.id },
        },
        timezone: university.timezone,
        admissionStartDate: university.admissionStart,
        admissionEndDate: university.admissionEnd,
        openServiceDate: university.openServiceDate,
        closeServiceDate: university.closeServiceDate,
        website: university.website,
        codes: university.codes,
        domains: university.domains,
        pairing_mode: university.pairingMode,
        max_tandems_per_user: university.maxTandemsPerUser,
        notification_email: university.notificationEmail,
      },
    });

    return university;
  }

  async findAll(
    params: GetUniversitiesCommand,
  ): Promise<Collection<University>> {
    const orderParam = params?.orderBy
      ? { [params?.orderBy.field]: params?.orderBy.order }
      : { name: 'asc' as SortOrder };

    const count = await this.prisma.organizations.count();

    const universities = await this.prisma.organizations.findMany({
      orderBy: orderParam,
      include: UniversityRelations,
    });

    return new Collection<University>({
      items: universities.map(universityMapper),
      totalItems: count,
    });
  }

  async findUniversityCentral(): Promise<University | null> {
    const university = await this.prisma.organizations.findFirst({
      where: { parent_id: null },
      include: UniversityRelations,
    });

    if (!university) {
      return null;
    }

    return universityMapper(university);
  }

  async havePartners(id: string): Promise<boolean> {
    const count = await this.prisma.organizations.count({
      where: { parent_id: id },
    });

    return count > 0;
  }

  async ofId(id: string): Promise<University | null> {
    const result = await this.prisma.organizations.findUnique({
      where: { id },
      include: UniversityRelations,
    });

    if (!result) {
      return null;
    }

    return universityMapper(result);
  }

  async ofName(name: string): Promise<University | null> {
    const result = await this.prisma.organizations.findUnique({
      where: { name },
      include: UniversityRelations,
    });

    if (!result) {
      return null;
    }

    return universityMapper(result);
  }

  async update(university: University): Promise<UpdateUniversityResponse> {
    await this.prisma.organizations.update({
      where: { id: university.id },
      data: {
        name: university.name,
        admissionEndDate: university.admissionEnd,
        admissionStartDate: university.admissionStart,
        openServiceDate: university.openServiceDate,
        closeServiceDate: university.closeServiceDate,
        timezone: university.timezone,
        codes: university.codes,
        domains: university.domains,
        website: university.website,
        Country: {
          connect: { id: university.country.id },
        },
        NativeLanguage: {
          connect: { id: university.nativeLanguage.id },
        },
        SpecificLanguagesAvailable: {
          set: [],
          connect: university.specificLanguagesAvailable.map((language) => ({
            id: language.id,
          })),
        },
        pairing_mode: university.pairingMode,
        max_tandems_per_user: university.maxTandemsPerUser,
        notification_email: university.notificationEmail,
        ...(university.defaultContactId
          ? {
              Contact: {
                connectOrCreate: {
                  where: { id: university.defaultContactId },
                  create: {
                    id: university.defaultContactId,
                  },
                },
              },
            }
          : {}),
      },
    });

    let users = [];
    // Update all users that have no contact with the universitie's default contact
    if (university.defaultContactId) {
      users = await this.prisma.users.findMany({
        where: {
          AND: [{ organization_id: university.id }, { contact_id: null }],
        },
      });

      await this.prisma.users.updateMany({
        where: {
          AND: [{ organization_id: university.id }, { contact_id: null }],
        },
        data: { contact_id: university.defaultContactId },
      });
    }

    const updatedUniversity = await this.prisma.organizations.findUnique({
      where: { id: university.id },
      include: UniversityRelations,
    });

    return {
      university: universityMapper(updatedUniversity),
      usersId: users.map((user) => user.id),
    };
  }

  async remove(id: string): Promise<void> {
    await this.prisma.organizations.delete({ where: { id } });
  }
}
