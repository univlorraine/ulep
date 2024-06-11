import { Controller, Post, Body } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { ObjectiveResponse } from '../dtos/objective';
import { SendNotificationRequest } from 'src/api/dtos/notifications';
import { SendMessageNotificationUsecase } from 'src/core/usecases/notifications';

@Controller('notifications')
@Swagger.ApiTags('Notifications')
export class NotificationController {
  constructor(
    private readonly sendMessageNotificationUsecase: SendMessageNotificationUsecase,
  ) {}

  @Post()
  @Swagger.ApiOperation({
    summary: 'Notify each user that a message has been sent.',
  })
  @Swagger.ApiCreatedResponse({ type: ObjectiveResponse })
  async sendMessageNotification(@Body() body: SendNotificationRequest) {
    await this.sendMessageNotificationUsecase.execute({
      content: body.content,
      usersId: body.usersId,
      senderId: body.senderId,
    });
  }
}
