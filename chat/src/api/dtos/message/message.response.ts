import * as Swagger from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Message } from 'src/core/models/message.model';

export class MessageResponse {
    @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
    @IsString()
    @IsNotEmpty()
    id: string;

    @Swagger.ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;

    @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
    @IsString()
    @IsNotEmpty()
    owner: string;

    @Swagger.ApiPropertyOptional({ type: 'boolean' })
    @IsBoolean()
    @IsOptional()
    isMine?: boolean;

    @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;

    constructor(partial: Partial<MessageResponse>) {
        Object.assign(this, partial);
    }

    static from(
        message: Message,
        { user }: { user?: string },
    ): MessageResponse {
        return new MessageResponse({
            id: message.id,
            content: message.content,
            owner: message.owner,
            isMine: user ? message.owner === user : undefined,
            createdAt: message.createdAt,
        });
    }
}
