import { Collection } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { Edito } from 'src/core/models/edito.model';
import {
  GenerateEditosUsecase,
  GetEditoUsecase,
  UpdateEditoUsecase,
  UploadEditoImageUsecase,
} from 'src/core/usecases';
import { GetEditosUsecase } from 'src/core/usecases/edito/get-editos.usecase';
import { Role, Roles } from '../decorators/roles.decorator';
import { EditoResponse } from '../dtos/editos/edito.response';
import { UpdateEditoRequest } from '../dtos/editos/update-edito.request';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators';

@ApiTags('Editos')
@Controller('editos')
export class EditoController {
  constructor(
    private readonly generateEditosUsecase: GenerateEditosUsecase,
    private readonly getEditosUsecase: GetEditosUsecase,
    private readonly getEditoUsecase: GetEditoUsecase,
    private readonly updateEditoUsecase: UpdateEditoUsecase,
    private readonly uploadEditoImageUsecase: UploadEditoImageUsecase,
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

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Swagger.ApiOperation({ summary: 'Get an Edito resource.' })
  @Swagger.ApiOkResponse({ type: EditoResponse })
  async getEdito(@Param('id') id: string) {
    const edito = await this.getEditoUsecase.execute(id);

    return EditoResponse.fromDomain(edito);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Update an Edito resource.' })
  @Swagger.ApiOkResponse({ type: EditoResponse })
  @UseInterceptors(FileInterceptor('file'))
  async updateEdito(
    @Param('id') id: string,
    @Body() body: UpdateEditoRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let edito = await this.updateEditoUsecase.execute({ id, ...body });

    if (file) {
      const uploadURL = await this.uploadEditoImageUsecase.execute({
        id: edito.id,
        file,
      });

      edito = new Edito({ ...edito, imageURL: uploadURL });
    }

    return EditoResponse.fromDomain(edito);
  }
}
