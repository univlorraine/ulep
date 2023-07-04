import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { CollectionResponse } from '../decorators/collection.decorator';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { MatchResponse } from '../dtos/matchs/match.response';
import { GetMatchsByProfileIdUsecase } from 'src/core/usecases/matchs/GetMatchsByProfileId';
import { GetMatchsRequest } from '../dtos/matchs/matchs.request';

@Controller('matches')
@Swagger.ApiTags('Matches')
export class MatchController {
  constructor(
    private getMatchsByProfileIdUsecase: GetMatchsByProfileIdUsecase,
  ) {}

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Match ressource.',
  })
  @CollectionResponse(MatchResponse)
  async getByProfileId(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { count }: GetMatchsRequest,
  ) {
    const matches = await this.getMatchsByProfileIdUsecase.execute({
      profileId: id,
      count,
    });

    return matches.map((match) => MatchResponse.fromDomain(match));
  }
}
