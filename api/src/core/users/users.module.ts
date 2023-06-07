import { Module } from '@nestjs/common';
import { UsersController } from './application/users.controller';
import { CreateUserUsecase } from './usecases/create-user.usecase';

@Module({
  controllers: [UsersController],
  providers: [CreateUserUsecase],
})
export class UsersModule {}
