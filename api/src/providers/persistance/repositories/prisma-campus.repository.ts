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
import { CampusRepository } from 'src/core/ports/campus.repository';
import { Campus } from 'src/core/models/campus.model';
import { campusMapper } from 'src/providers/persistance/mappers';

@Injectable()
export class PrismaCampusRepository implements CampusRepository {
  constructor(private readonly prisma: PrismaService) {}
  async all(): Promise<Collection<Campus>> {
    const count = await this.prisma.places.count({});
    const campus = await this.prisma.places.findMany({});

    return new Collection<Campus>({
      items: campus.map(campusMapper),
      totalItems: count,
    });
  }

  async ofId(id: string): Promise<Campus> {
    const campus = await this.prisma.places.findUnique({ where: { id } });

    if (!campus) {
      return null;
    }

    return campusMapper(campus);
  }

  async create(campus: Campus): Promise<Campus> {
    const newCampus = await this.prisma.places.create({
      data: {
        id: campus.id,
        name: campus.name,
        Organization: { connect: { id: campus.universityId } },
      },
    });

    return campusMapper(newCampus);
  }

  async update(campus: Campus): Promise<Campus> {
    await this.prisma.places.update({
      where: {
        id: campus.id,
      },
      data: {
        name: campus.name,
        Organization: { connect: { id: campus.universityId } },
      },
    });

    const updatedCampus = await this.prisma.places.findUnique({
      where: { id: campus.id },
    });

    return campusMapper(updatedCampus);
  }
  async delete(id: string): Promise<void> {
    const campus = await this.ofId(id);

    if (!campus) {
      return;
    }

    await this.prisma.places.delete({ where: { id } });
  }

  private readonly logger = new Logger(PrismaCampusRepository.name);
}
