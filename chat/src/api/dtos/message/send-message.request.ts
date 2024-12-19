import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MessageType } from 'src/core/models';

export class SendMessageRequest {
    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    senderId: string;

    @IsString()
    @IsOptional()
    filename?: string;

    @IsEnum(MessageType)
    @IsOptional()
    type?: MessageType;
}
