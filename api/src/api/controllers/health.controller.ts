import { Controller, Get, SerializeOptions } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import * as Swagger from '@nestjs/swagger';
import { I18nService, PrismaService } from '@app/common';

@Controller('health')
@Swagger.ApiExcludeController()
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  @HealthCheck()
  @SerializeOptions({ strategy: 'exposeAll' })
  async health(): Promise<any> {
    return this.healthCheckService.check([
      () => this.prisma.pingCheck('prisma', this.prismaService),
    ]);
  }
}
