import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateProfileDto } from './create-profile.dto';
import { ProfilesService } from './profiles.service';
import Profile from './profiles.entity';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profilesService.create(createProfileDto);
  }
}
