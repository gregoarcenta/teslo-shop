import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiUploadResponse = () => {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'The image was successfully uploaded to the server.',
      example: { public_id: 's6xa6iiwa7pew6rpymbq.jpg', format: 'jpg' },
    }),
    ApiErrorResponses({
      badRequest: true,
      forbidden: true,
      unauthorized: true,
      internalServerError: true,
    }),
  );
};
