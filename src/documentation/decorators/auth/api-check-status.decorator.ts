import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from "@nestjs/swagger";
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiCheckStatusResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'User has been successfully registered.',
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
      unauthorized: true,
      internalServerError: true,
    }),
  );
};
