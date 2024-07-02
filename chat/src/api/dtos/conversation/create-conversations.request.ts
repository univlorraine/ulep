import * as Swagger from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateConversation {
    @Swagger.ApiProperty({
        type: 'string',
        isArray: true,
        example: ['user1', 'user2'],
    })
    @IsArray()
    @IsString({ each: true })
    participants: string[];

    @Swagger.ApiProperty({
        type: 'string',
        required: false,
        example: 'tandem123',
    })
    @IsOptional()
    @IsString()
    tandemId?: string;
}

export class CreateConversationsRequest {
    @Swagger.ApiProperty({
        type: CreateConversation,
        isArray: true,
        example: [
            { participants: ['user1', 'user2'], tandemId: 'tandem123' },
            { participants: ['user3', 'user4'] },
        ],
    })
    @IsArray()
    conversations: CreateConversation[];
}
