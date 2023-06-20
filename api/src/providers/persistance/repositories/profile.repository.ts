import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProfileRepository } from 'src/core/ports/profile.repository';
import { profileMapper } from '../mappers/profile.mapper';
import { Profile } from 'src/core/models/profile';
import { Collection } from 'src/shared/types/collection';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  private readonly _include = {
    organization: { include: { country: true } },
    languages: true,
    nationality: true,
    avatar: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string) {
    const entry = await this.prisma.profile.findUnique({
      where: { id },
      include: this._include,
    });

    if (!entry) {
      return null;
    }

    return profileMapper(entry);
  }

  async ofEmail(email: string) {
    const entry = await this.prisma.profile.findUnique({
      where: { email },
      include: this._include,
    });

    if (!entry) {
      return null;
    }

    return profileMapper(entry);
  }

  async ofLanguage(languageId: string) {
    const entries = await this.prisma.profile.findMany({
      where: {
        languages: {
          some: {
            id: languageId,
          },
        },
      },
      include: this._include,
    });

    return entries.map(profileMapper);
  }

  async findAll(offset?: number, limit?: number): Promise<Collection<Profile>> {
    const count = await this.prisma.profile.count();

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const items = await this.prisma.profile.findMany({
      skip: offset,
      take: limit,
      include: this._include,
    });

    const profiles = items.map(profileMapper);

    return { items: profiles, totalItems: count };
  }

  async save(profile: Profile): Promise<void> {
    const payload = {
      id: profile.id,
      email: profile.email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      birthdate: new Date(profile.birthdate),
      gender: profile.gender,
      role: profile.role,
      metadata: {
        goals: profile.goals,
        meetingFrequency: profile.meetingFrequency,
        bios: profile.bios,
      },
      organization: {
        connect: {
          id: profile.university.id,
        },
      },
      nationality: {
        connect: {
          id: profile.nationality.id,
        },
      },
    };

    await this.prisma.profile.upsert({
      where: { id: profile.id },
      update: payload,
      create: payload,
    });
  }

  async delete(profile: Profile): Promise<void> {
    await this.prisma.profile.delete({ where: { id: profile.id } });
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
      include: {
        profiles: true,
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
