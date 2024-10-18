import { Collection } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { EventObject } from 'src/core/models/event.model';
import { UploadEventImageUsecase } from 'src/core/usecases';
import {
  CreateEventUsecase,
  DeleteEventUsecase,
  GetEventsUsecase,
  GetEventUsecase,
  SubscribeToEventUsecase,
  UnsubscribeToEventUsecase,
  UpdateEventUsecase,
} from 'src/core/usecases/event';
import { CollectionResponse } from '../decorators';
import { Role, Roles } from '../decorators/roles.decorator';
import { EventResponse, UpdateEventRequest } from '../dtos/events';
import { CreateEventRequest } from '../dtos/events/create-event.request';
import { GetEventsQuery } from '../dtos/events/get-events.request';
import { SubscribeToEventRequest } from '../dtos/events/subscribe-to-event.request';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly createEventUsecase: CreateEventUsecase,
    private readonly uploadEventImageUsecase: UploadEventImageUsecase,
    private readonly getEventsUsecase: GetEventsUsecase,
    private readonly getEventUsecase: GetEventUsecase,
    private readonly updateEventUsecase: UpdateEventUsecase,
    private readonly subscribeToEventUsecase: SubscribeToEventUsecase,
    private readonly unsubscribeToEventUsecase: UnsubscribeToEventUsecase,
    private readonly deleteEventUsecase: DeleteEventUsecase,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Swagger.ApiOperation({ summary: 'Get Events resources.' })
  @CollectionResponse(EventResponse)
  async getEvents(@Query() query: GetEventsQuery) {
    const events = await this.getEventsUsecase.execute({
      pagination: {
        page: query.page,
        limit: query.limit,
      },
      filters: {
        title: query.title,
        authorUniversityId: query.authorUniversityId,
        concernedUniversitiesIds: query.concernedUniversitiesIds,
        status: query.status,
        types: query.types,
        languageCode: query.languageCode,
      },
    });

    return new Collection<EventResponse>({
      items: events.items.map(EventResponse.fromDomain),
      totalItems: events.totalItems,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'event:enrolledUsers'] })
  @Swagger.ApiOperation({ summary: 'Get an Event resource.' })
  @Swagger.ApiOkResponse({ type: EventResponse })
  async getEvent(@Param('id', ParseUUIDPipe) id: string) {
    const event = await this.getEventUsecase.execute(id);

    return EventResponse.fromDomain(event);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'event:enrolledUsers'] })
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Create an Event resource.' })
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

    return EventResponse.fromDomain(event);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'event:enrolledUsers'] })
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Update an Event resource.' })
  @Swagger.ApiOkResponse({ type: EventResponse })
  @UseInterceptors(FileInterceptor('file'))
  async updateEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEventRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let event = await this.updateEventUsecase.execute({ id, ...body });

    if (file) {
      const uploadURL = await this.uploadEventImageUsecase.execute({
        id: event.id,
        file,
      });

      event = new EventObject({ ...event, imageURL: uploadURL });
    }

    return EventResponse.fromDomain(event);
  }

  @Post(':id/subscribe')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'event:enrolledUsers'] })
  @Swagger.ApiOperation({ summary: 'Subscribe users to an Event resource.' })
  @Swagger.ApiOkResponse({ type: EventResponse })
  @UseInterceptors(AnyFilesInterceptor())
  async subscribeToEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SubscribeToEventRequest,
  ) {
    const event = await this.subscribeToEventUsecase.execute({
      eventId: id,
      usersIds: body.usersIds,
    });

    return EventResponse.fromDomain(event);
  }

  @Post(':id/unsubscribe')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'event:enrolledUsers'] })
  @Swagger.ApiOperation({ summary: 'Unsubscribe users to an Event resource.' })
  @Swagger.ApiOkResponse({ type: EventResponse })
  @UseInterceptors(AnyFilesInterceptor())
  async unsubscribeToEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SubscribeToEventRequest,
  ) {
    const event = await this.unsubscribeToEventUsecase.execute({
      eventId: id,
      usersIds: body.usersIds,
    });

    return EventResponse.fromDomain(event);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Delete an Event resource.' })
  @Swagger.ApiOkResponse({ type: EventResponse })
  async deleteEvent(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteEventUsecase.execute(id);
  }
}
