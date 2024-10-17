import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from "@nestjs/swagger";
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { Product } from '../../../products/entities';

export const ApiFindProductResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'The product details have been successfully retrieved.',
      type: Product,
    }),
    ApiErrorResponses({
      badRequest: true,
      notFound: true,
      internalServerError: true,
    }),
  );
};
