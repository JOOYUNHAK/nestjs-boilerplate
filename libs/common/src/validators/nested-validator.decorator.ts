import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export function NestedValidator(typeFn: () => Function): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    const designType = Reflect.getMetadata(
      'design:type',
      target,
      propertyKey as string,
    );

    designType === Array
      ? ValidateNested({ each: true })(target, propertyKey)
      : ValidateNested()(target, propertyKey);

    Type(typeFn)(target, propertyKey as string);
  };
}
