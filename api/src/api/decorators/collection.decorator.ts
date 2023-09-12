import { Collection } from '@app/common';
import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const CollectionResponse = <T extends Type<unknown>>(type: T) =>
  applyDecorators(
    ApiExtraModels(Collection, type),
    ApiOkResponse({
      schema: {
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(type) },
          },
          totalItems: {
            type: 'number',
            example: 30,
          },
        },
      },
    }),
  );
