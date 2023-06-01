import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateProfileUsecase } from './usecases/create-profile.usecase';
import { CreateProfileRequest } from './dtos/create-profile.request';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly createProfileUsecase: CreateProfileUsecase) {}

  @Post()
  @ApiOperation({ summary: 'Create Profile ressource' })
  async create(@Body() body: CreateProfileRequest): Promise<void> {
    return this.createProfileUsecase.execute({ email: body.email });
  }
}
