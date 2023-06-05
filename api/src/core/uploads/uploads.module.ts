import { Module } from '@nestjs/common';
import { UploadsController } from './application/uploads.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProvidersModule } from 'src/providers/providers.module';
import { UploadImageUsecase } from './usecases/upload-image.usecase';

@Module({
  imports: [ProvidersModule, ThrottlerModule.forRoot({ ttl: 60, limit: 10 })],
  controllers: [UploadsController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    UploadImageUsecase,
  ],
})
export class UploadsModule {}
