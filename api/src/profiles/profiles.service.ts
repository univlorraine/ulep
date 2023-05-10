import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileDto } from './create-profile.dto';
import Profile from './profiles.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  create(createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profilesRepository.save(
      this.profilesRepository.create(createProfileDto),
    );
  }

  findOne(fields: FindOptionsWhere<Profile>): Promise<Profile | null> {
    return this.profilesRepository.findOne({
      where: fields,
    });
  }
}
