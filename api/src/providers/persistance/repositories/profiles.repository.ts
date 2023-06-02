import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProfileRepository } from 'src/profiles/domain/profiles.repository';
import Profile from 'src/profiles/domain/profile';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  private readonly logger = new Logger(PrismaProfileRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createProfile(profile: Profile): Promise<void> {
    await this.prisma.profile.create({ data: { email: profile.getEmail() } });
  }
}
