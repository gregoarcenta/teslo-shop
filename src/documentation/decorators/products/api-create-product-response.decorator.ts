import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { Product } from '../../../products/entities';

export const ApiCreateProductResponse = () => {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'The product has been successfully created.',
      type: Product,
    }),
    ApiErrorResponses({
      badRequest: true,
      forbidden: true,
      unauthorized: true,
      internalServerError: true,
    }),
  );
};
