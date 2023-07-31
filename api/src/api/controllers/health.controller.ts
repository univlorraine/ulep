import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';
import * as Swagger from '@nestjs/swagger';

@Controller('health')
@Swagger.ApiExcludeController()
export class HealthController {
  constructor(private healthCheckService: HealthCheckService) {}

  @Get()
  async health(): Promise<any> {
    return this.healthCheckService.check([]);
  }
}
