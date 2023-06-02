import { Repository } from 'typeorm';
import { ProfileEntity } from '../entities/profile.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProfilesRepository extends Repository<ProfileEntity> {
  private readonly logger = new Logger(ProfilesRepository.name);

  async createProfile(email: string): Promise<void> {
    // todo: this dont work
    await this.insert({ email: email });
  }
}
