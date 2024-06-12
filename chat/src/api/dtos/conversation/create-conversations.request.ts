import * as Swagger from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CreateConversationsRequest {
    @Swagger.ApiProperty({
        type: 'string',
        isArray: true,
        example: [
            ['user1', 'user2'],
            ['user3', 'user4'],
        ],
    })
    @IsArray()
    participants: string[][];
}
