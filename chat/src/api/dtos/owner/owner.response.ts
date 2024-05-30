import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Owner } from 'src/core/models/owner.model';

export class OwnerResponse {
    @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
    @Expose({ groups: ['read'] })
    id: string;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    name: string;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    image: string;

    constructor(partial: Partial<OwnerResponse>) {
        Object.assign(this, partial);
    }

    static from(message: Owner): OwnerResponse {
        return new OwnerResponse({
            id: message.id,
            name: message.name,
            image: message.image,
        });
    }
}
