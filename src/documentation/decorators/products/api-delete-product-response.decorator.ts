import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from "@nestjs/swagger";
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiDeleteProductResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'The product has been successfully deleted.',
      example:"Product T-shirt teslo has been removed"
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
