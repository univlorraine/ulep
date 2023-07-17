import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { CollectionResponse } from '../decorators/collection.decorator';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { MatchResponse } from '../dtos/matchs/match.response';
import { GetMatchsByProfileIdUsecase } from 'src/core/usecases/matchs/GetMatchsByProfileId';
import { GetMatchsRequest } from '../dtos/matchs/matchs.request';
import { Collection } from 'src/shared/types/collection';

@Controller('matches')
@Swagger.ApiTags('Matches')
export class MatchController {
  constructor(
    private getMatchsByProfileIdUsecase: GetMatchsByProfileIdUsecase,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Match ressource.',
  })
  @CollectionResponse(MatchResponse)
  async getByProfileId(@Query() { id, count }: GetMatchsRequest) {
    const matches = await this.getMatchsByProfileIdUsecase.execute({
      profileId: id,
      count,
    });

    return new Collection<MatchResponse>({
      items: matches.items.map(MatchResponse.fromDomain),
      totalItems: matches.totalItems,
    });
  }
}
