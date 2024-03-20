import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { CollectionResponse } from '../decorators';
import { TandemResponse } from '../dtos';
import { AuthenticationGuard } from '../guards';
import { GetOtherUserEmailInTandemUsecase } from 'src/core/usecases/tandemHistory/get-email-from-history-tandem.usecase';
import { GetOtherUserEmailInTandemRequest } from 'src/api/dtos/tandem-history';
import { GetEmailFromHistoricTandemResponse } from 'src/api/dtos/tandem-history/get-email-from-history-tandem.response';

@Controller('tandem-history')
@Swagger.ApiTags('Tandem History')
export class TandemHistoryController {
  constructor(
    private readonly getOtherUserEmailInTandemUsecase: GetOtherUserEmailInTandemUsecase,
  ) {}

  @Get('partner-email')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Get the email of the other user in the tandem history',
  })
  async getOtherUserEmailInTandem(
    @Query() { languageId, userId }: GetOtherUserEmailInTandemRequest,
  ): Promise<GetEmailFromHistoricTandemResponse> {
    const historizedTandem =
      await this.getOtherUserEmailInTandemUsecase.execute({
        languageId,
        userId,
      });

    return GetEmailFromHistoricTandemResponse.fromDomain(historizedTandem);
  }
}
