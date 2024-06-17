import { IsBoolean, IsString } from 'class-validator';

export class UpdateMessageRequest {
    @IsBoolean()
    isReported: boolean;

    @IsString()
    content: string;
}
