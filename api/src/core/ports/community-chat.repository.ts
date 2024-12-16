import { CommunityChat } from 'src/core/models/community-chat.model';

export const COMMUNITY_CHAT_REPOSITORY = 'community-chat.repository';

export type CommunityChatCreationPayload = {
  id: string;
  centralLanguageCode: string;
  partnerLanguageCode: string;
};

export interface CommunityChatRepository {
  create(payload: CommunityChatCreationPayload): Promise<CommunityChat>;
  ofId(id: string): Promise<CommunityChat | null>;
  findByLanguageCodes(
    centralLanguageCode: string,
    partnerLanguageCode: string,
  ): Promise<CommunityChat | null>;
}
