import { Collection } from '@app/common';
import {
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { GenerateEditosUsecase } from 'src/core/usecases';
import { GetEditosUsecase } from 'src/core/usecases/edito/get-editos.usecase';
import { Role, Roles } from '../decorators/roles.decorator';
import { EditoResponse } from '../dtos/editos/edito.response';
import { AuthenticationGuard } from '../guards';

@ApiTags('Editos')
@Controller('editos')
export class EditoController {
  constructor(
    private readonly generateEditosUsecase: GenerateEditosUsecase,
    private readonly getEditosUsecase: GetEditosUsecase,
  ) {}

  @Post('/generate')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Create an Edito resource.' })
  @Swagger.ApiOkResponse({ type: EditoResponse })
  async generateEditos() {
    await this.generateEditosUsecase.execute();
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Get all Editos.' })
  @Swagger.ApiOkResponse({ type: Collection<EditoResponse> })
  async getEditos() {
    const editos = await this.getEditosUsecase.execute();

    return new Collection<EditoResponse>({
      items: editos.map((edito) => EditoResponse.fromDomain(edito)),
      totalItems: editos.length,
    });
  }
}
