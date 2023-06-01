import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/providers/persistance/entities/profile.entity';
import { Repository } from 'typeorm';

export class CreateProfileCommand {
  email: string;
}

@Injectable()
export class CreateProfileUsecase {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>,
  ) {}

  async execute({ email }: CreateProfileCommand): Promise<void> {
    await this.profilesRepository.save(
      this.profilesRepository.create({ email }),
    );
  }
}
