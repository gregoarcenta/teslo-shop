import { applyDecorators } from "@nestjs/common";
import { ApiQuery} from "@nestjs/swagger";

export const ApiResponsesPaginationProduct = () => {
  return applyDecorators(
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Limit of results, default is 10',
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      type: Number,
      description: 'Offset for results, default is 0',
    })
  )
};
