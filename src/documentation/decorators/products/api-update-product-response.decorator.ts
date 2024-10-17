import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from "@nestjs/swagger";
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { Product } from '../../../products/entities';

export const ApiUpdateProductResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'The product has been successfully updated.',
      type: Product,
    }),
    ApiErrorResponses({
      badRequest: true,
      notFound: true,
      forbidden: true,
      unauthorized: true,
      internalServerError: true,
    }),
  );
};
