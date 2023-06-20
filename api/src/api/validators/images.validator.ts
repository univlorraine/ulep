/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

interface IsImageOptions {
  mime: ('image/jpg' | 'image/png' | 'image/jpeg')[];
}

export function IsImage(
  options: IsImageOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    return registerDecorator({
      name: 'isImage',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            value?.mimetype && (options?.mime ?? []).includes(value?.mimetype)
          );
        },
      },
    });
  };
}
