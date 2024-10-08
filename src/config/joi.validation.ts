import * as Joi from 'joi';

export const joiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  PORT: Joi.number().port().default(3000),
});
