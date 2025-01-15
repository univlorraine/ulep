import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Hashtag } from 'src/core/models/hashtag.model';

export class HashtagResponse {
    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    name: string;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    numberOfUses: number;

    constructor(partial: Partial<HashtagResponse>) {
        Object.assign(this, partial);
    }

    static from(hashtag: Hashtag): HashtagResponse {
        return new HashtagResponse({
            name: hashtag.name,
            numberOfUses: hashtag.numberOfUses,
        });
    }
}
