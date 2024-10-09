import { KeycloakUser } from '@app/keycloak';
import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/api/guards';
import { CancelSessionUsecase } from 'src/core/usecases/session/cancel-session.usecase';
import { CreateSessionUsecase } from 'src/core/usecases/session/create-session.usecase';
import { UpdateSessionUsecase } from 'src/core/usecases/session/update-session.usecase';
import { CurrentUser } from '../decorators/current-user.decorator';
import {
  CreateSessionRequest,
  SessionResponse,
  UpdateSessionRequest,
} from '../dtos';
import { CancelSessionRequest } from '../dtos/session/cancel-session.request';

@Controller('session')
@Swagger.ApiTags('Session')
export class SessionController {
  constructor(
    private readonly createSessionUsecase: CreateSessionUsecase,
    private readonly updateSessionUsecase: UpdateSessionUsecase,
    private readonly cancelSessionUsecase: CancelSessionUsecase,
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Session ressource.' })
  @Swagger.ApiCreatedResponse({ type: () => SessionResponse })
  async createSession(
    @Body() body: CreateSessionRequest,
    @CurrentUser() user: KeycloakUser,
  ) {
    const session = await this.createSessionUsecase.execute({ user, ...body });

    return SessionResponse.from(session);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Session ressource.' })
  @Swagger.ApiCreatedResponse({ type: () => SessionResponse })
  async updateSession(
    @Param('id') id: string,
    @CurrentUser() user: KeycloakUser,
    @Body() body: UpdateSessionRequest,
  ) {
    const session = await this.updateSessionUsecase.execute({
      user,
      sessionId: id,
      ...body,
    });

    return SessionResponse.from(session);
  }

  @Post(':id/cancel')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Cancel a Session ressource.' })
  @Swagger.ApiOkResponse()
  async cancelSession(
    @CurrentUser() user: KeycloakUser,
    @Param('id') id: string,
    @Body() body: CancelSessionRequest,
  ) {
    await this.cancelSessionUsecase.execute({
      user,
      sessionId: id,
      comment: body.comment,
    });
  }
}
