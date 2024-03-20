import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { HistorizedTandem } from 'src/core/models/historized-tandem.model';

export class GetEmailFromHistoricTandemResponse {
  @Swagger.ApiProperty({ type: 'string', nullable: true })
  @Expose({ groups: ['read'] })
  email: string | undefined = undefined;

  constructor(partial: Partial<GetEmailFromHistoricTandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    tandem: HistorizedTandem,
  ): GetEmailFromHistoricTandemResponse {
    return new GetEmailFromHistoricTandemResponse({
      email: tandem.userEmail,
    });
  }
}
