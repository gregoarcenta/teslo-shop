import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from "@nestjs/swagger";
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiGetImageResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'The requested image has been successfully retrieved.',
    }),
    ApiErrorResponses({
      badRequest: true,
      notFound: true,
      internalServerError: true,
    }),
  );
};
