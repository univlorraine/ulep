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

import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { CommunityChat } from 'src/core/models/community-chat.model';
import {
  CommunityChatCreationPayload,
  CommunityChatRepository,
} from 'src/core/ports/community-chat.repository';
import {
  communityChatMapper,
  CommunityChatRelations,
} from 'src/providers/persistance/mappers/community-chat.mapper';

@Injectable()
export class PrismaCommunityChatRepository implements CommunityChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CommunityChatCreationPayload): Promise<CommunityChat> {
    const result = await this.prisma.communityChat.create({
      data: {
        id: payload.id,
        CentralLanguage: { connect: { code: payload.centralLanguageCode } },
        PartnerLanguage: { connect: { code: payload.partnerLanguageCode } },
      },
      ...CommunityChatRelations,
    });

    return communityChatMapper(result);
  }

  async all(): Promise<CommunityChat[]> {
    const result = await this.prisma.communityChat.findMany({
      ...CommunityChatRelations,
    });

    return result.map(communityChatMapper);
  }

  async findByLanguageCodes(
    firstLanguageCode: string,
    secondLanguageCode: string,
  ): Promise<CommunityChat | null> {
    const result = await this.prisma.communityChat.findFirst({
      where: {
        OR: [
          {
            CentralLanguage: { code: firstLanguageCode },
            PartnerLanguage: { code: secondLanguageCode },
          },
          {
            CentralLanguage: { code: secondLanguageCode },
            PartnerLanguage: { code: firstLanguageCode },
          },
        ],
      },
      ...CommunityChatRelations,
    });

    if (!result) {
      return null;
    }

    return communityChatMapper(result);
  }

  async ofId(id: string): Promise<CommunityChat | null> {
    const result = await this.prisma.communityChat.findUnique({
      where: { id },
      ...CommunityChatRelations,
    });

    if (!result) {
      return null;
    }

    return communityChatMapper(result);
  }

  async deleteAll(): Promise<void> {
    await this.prisma.communityChat.deleteMany();
  }
}
