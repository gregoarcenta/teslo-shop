import { applyDecorators } from '@nestjs/common';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { ApiOkResponse } from "@nestjs/swagger";

export const ApiSignInResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'User has been successfully login.',
      example: {
        user: {
          email: 'test3@google.com',
          fullName: 'test full name',
          id: '0a99267b-ff9b-44e9-994f-3eddfe9ce975',
          isActive: true,
          roles: ['user'],
        },
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBhOTkyNjdiLWZmOWItNDRlOS05OTRmLTNlZGRmZTljZTk3NSIsImlhdCI',
      },
    }),
    ApiErrorResponses({
      badRequest: true,
      unauthorized: true,
      internalServerError: true,
    }),
  );
};
