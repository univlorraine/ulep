import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheckService } from '@nestjs/terminus';

@Controller('health')
@ApiExcludeController()
export class HealthController {
  constructor(private healthCheckService: HealthCheckService) {}

  @Get()
  async health(): Promise<any> {
    return this.healthCheckService.check([]);
  }
}
