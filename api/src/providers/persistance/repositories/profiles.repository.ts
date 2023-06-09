import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProfileRepository } from 'src/core/profiles/domain/profiles.repository';
import Profile from 'src/core/profiles/domain/profile';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  private readonly logger = new Logger(PrismaProfileRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  save: (profile: Profile) => Promise<void>;

  async findByLanguage(languageCode: string) {
    const entries = await this.prisma.language.findMany({
      where: {
        languageCode: {
          code: languageCode,
        },
      },
      select: {
        profile: true,
      },
    });

    return entries.map((entry) => entry.profile);
  }

  async findMatchs(id: string) {
    const matches = await this.prisma.match.findMany({
      where: {
        profiles: {
          some: {
            profileId: id,
          },
        },
      },
    });

    return matches;
  }

  async addProfileToMatch(matchId: string, profileId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { profiles: true },
    });

    // if match already has 2 profiles throw error
    if (match.profiles.length >= 2) {
      throw new Error('Match already has 2 profiles');
    }

    // Ajoute le profil au match
    await this.prisma.profileMatch.create({
      data: {
        matchId: matchId,
        profileId: profileId,
      },
    });
  }
}
