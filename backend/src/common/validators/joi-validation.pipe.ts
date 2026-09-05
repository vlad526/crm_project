import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

import type { ObjectSchema, ValidationResult, ValidationErrorItem } from 'joi';

@Injectable()
export class JoiValidationPipe<T> implements PipeTransform<T, T> {
  constructor(private readonly schema: ObjectSchema) {}

  transform(value: T, metadata: ArgumentMetadata): T {
    if (metadata.type !== 'body') {
      return value;
    }

    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Request body is empty');
    }

    const result: ValidationResult = this.schema.validate(value, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (result.error) {
      const errorMessage = result.error.details
        .map((d: ValidationErrorItem) => d.message)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errorMessage}`);
    }

    return value;
  }
}
