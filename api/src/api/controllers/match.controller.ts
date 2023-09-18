import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { GetMatchsRequest, MatchResponse } from '../dtos';
import { Collection } from '@app/common';
import { CollectionResponse } from '../decorators';
import { AuthenticationGuard } from '../guards';
import { GetUserMatchUsecase } from '../../core/usecases/tandem/get-users-matchs.usecase';
import { configuration } from 'src/configuration';
import { Roles } from '../decorators/roles.decorator';

@Controller('matches')
@Swagger.ApiTags('Matches')
export class MatchController {
  constructor(private getUserMatchUsecase: GetUserMatchUsecase) {}

  @Get()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Match ressource.',
  })
  @CollectionResponse(MatchResponse)
  async getLearningLangugeMatches(
    @Query() { id, count, universityIds }: GetMatchsRequest,
  ) {
    const matches = await this.getUserMatchUsecase.execute({
      id,
      count,
      universityIds:
        typeof universityIds === 'string' ? [universityIds] : universityIds,
    });

    // TODO(CLEAN): Check if this endpoint is still used

    return new Collection<MatchResponse>({
      items: matches.items.map(MatchResponse.fromDomain),
      totalItems: matches.totalItems,
    });
  }
}
