import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CollectionResponse<T> {
    @Swagger.ApiProperty({ isArray: true })
    @Expose({ groups: ['read'] })
    readonly items: readonly T[];

    @Swagger.ApiProperty()
    @Expose({ groups: ['read'] })
    readonly totalItems: number;

    constructor({
        items,
        totalItems,
    }: {
        items: readonly T[];
        totalItems: number;
    }) {
        this.items = items;
        this.totalItems = totalItems;
    }
}
