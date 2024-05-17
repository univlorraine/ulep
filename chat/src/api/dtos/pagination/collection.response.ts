import * as Swagger from '@nestjs/swagger';

export class CollectionResponse<T> {
    @Swagger.ApiProperty({ isArray: true })
    readonly items: readonly T[];

    @Swagger.ApiProperty()
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
