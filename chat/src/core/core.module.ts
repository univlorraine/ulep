import { Module, Provider } from '@nestjs/common';
import { UploadMediaUsecase } from 'src/core/usecases';
import { ProvidersModule } from 'src/providers/providers.module';

const usecases: Provider[] = [UploadMediaUsecase];

const services: Provider[] = [];

@Module({
    imports: [ProvidersModule],
    providers: [...usecases, ...services],
    exports: [...usecases, ...services],
})
export class CoreModule {}
