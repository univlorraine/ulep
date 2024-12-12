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

  async findByLanguageCodes(
    centralLanguageCode: string,
    partnerLanguageCode: string,
  ): Promise<CommunityChat | null> {
    const result = await this.prisma.communityChat.findFirst({
      where: {
        CentralLanguage: { code: centralLanguageCode },
        PartnerLanguage: { code: partnerLanguageCode },
      },
      ...CommunityChatRelations,
    });

    if (!result) {
      return null;
    }

    return communityChatMapper(result);
  }
}
