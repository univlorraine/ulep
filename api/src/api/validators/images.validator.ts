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
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    return registerDecorator({
      name: 'isImage',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          return (
            value?.mimetype && (options?.mime ?? []).includes(value?.mimetype)
          );
        },
      },
    });
  };
}
