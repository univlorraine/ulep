import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateProfileDto } from './create-profile.dto';
import { ProfilesService } from './profiles.service';
import Profile from './profiles.entity';
import { AuthenticationGuard } from 'src/common/authentication/authentication.guard';

@UseGuards(AuthenticationGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  async findAll(): Promise<Profile[]> {
    return [];
  }
}
