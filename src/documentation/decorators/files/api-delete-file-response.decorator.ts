import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiDeleteFileResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description:
        'The specified image has been successfully deleted from the server.',
      example: 'The image with the id: ${id} was removed',
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
