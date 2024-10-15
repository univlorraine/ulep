import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { EventObject } from 'src/core/models/event.model';
import { UploadEventImageUsecase } from 'src/core/usecases';
import { CreateEventUsecase } from 'src/core/usecases/event';
import { Role, Roles } from '../decorators/roles.decorator';
import { EventResponse } from '../dtos/events';
import { CreateEventRequest } from '../dtos/events/event.request';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  private readonly defaultLanguageCode: string;

  constructor(
    private readonly createEventUsecase: CreateEventUsecase,
    private readonly uploadEventImageUsecase: UploadEventImageUsecase,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get all public Events ressources.' })
  async getPublicEvents() {
    console.log('getPublicEvents');
    return [];
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Create a Event ressource.' })
  @Swagger.ApiOkResponse({ type: EventResponse })
  @UseInterceptors(FileInterceptor('file'))
  async createEvent(
    @Body() body: CreateEventRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let event = await this.createEventUsecase.execute(body);

    if (file) {
      const uploadURL = await this.uploadEventImageUsecase.execute({
        id: event.id,
        file,
      });

      event = new EventObject({ ...event, imageURL: uploadURL });
    }

    console.log(event);

    return EventResponse.fromDomain(event);
  }
}
