import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateMessageRequest {
    @IsBoolean()
    @IsOptional()
    isReported: boolean;

    @IsBoolean()
    @IsOptional()
    isDeleted: boolean;

    @IsString()
    @IsOptional()
    content: string;
}
