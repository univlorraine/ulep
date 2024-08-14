import { IsOptional, IsString } from 'class-validator';

export class SendMessageRequest {
    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    senderId: string;

    @IsString()
    @IsOptional()
    filename?: string;
}
