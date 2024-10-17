import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from '../documentation/decorators/api-error-responses.decorator';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOkResponse({
    description: 'User has been successfully registered.',
    example: 'Execute Seed',
  })
  @ApiErrorResponses({
    badRequest: true,
    internalServerError: true,
  })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
