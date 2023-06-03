import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateProfileUsecase } from '../usecases/create-profile.usecase';
import { CreateProfileRequest } from './create-profile.request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/core/authentication/application/authentication.guard';

@Controller('profiles')
@ApiTags('Profiles')
export class ProfilesController {
  constructor(private readonly createProfileUsecase: CreateProfileUsecase) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Create profile ressource' })
  async create(@Body() body: CreateProfileRequest): Promise<void> {
    return this.createProfileUsecase.execute({ email: body.email });
  }
}
