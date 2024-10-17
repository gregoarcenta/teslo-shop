import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from "@nestjs/swagger";
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { Product } from '../../../products/entities';
import { ApiResponsesPaginationProduct } from "./api-responses-pagination-product.decorator";

export const ApiFindAllProductResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'The list of all products has been successfully retrieved.',
      type: [Product],
    }),
    ApiResponsesPaginationProduct(),
    ApiErrorResponses({
      badRequest: true,
      internalServerError: true,
    }),
  );
};
