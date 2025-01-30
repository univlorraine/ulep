import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import { ChatService } from 'src/providers/services/chat.service';
import { ReportStatus } from '../../models';
import {
  ReportRepository,
  REPORT_REPOSITORY,
} from '../../ports/report.repository';

export class UpdateReportStatusCommand {
  id: string;
  status: ReportStatus;
  comment?: string;
  shouldDeleteMessage?: boolean;
}

@Injectable()
export class UpdateReportStatusUsecase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepository,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
  ) {}

  async execute(command: UpdateReportStatusCommand) {
    const instance = await this.reportRepository.reportOfId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    if (
      command.shouldDeleteMessage !== undefined &&
      command.shouldDeleteMessage !== instance.metadata?.isMessageDeleted &&
      instance.metadata?.messageId
    ) {
      await this.chatService.deleteMessage(
        instance.metadata?.messageId,
        command.shouldDeleteMessage,
      );
    }

    return this.reportRepository.updateReport(
      command.id,
      command.status,
      command.comment,
      {
        ...instance.metadata,
        isMessageDeleted:
          command.shouldDeleteMessage || instance.metadata?.isMessageDeleted,
      },
    );
  }
}
