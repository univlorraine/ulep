import { IsString } from 'class-validator';

export class SendMessageRequest {
    @IsString()
    content: string;

    @IsString()
    senderId: string;
}
