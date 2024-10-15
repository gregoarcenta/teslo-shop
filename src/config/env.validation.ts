import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  PORT: Joi.number().port().default(3000),
  DEFAULT_LIMIT: Joi.number().positive().default(10),
  CLOUDINARY_NAME:Joi.string().required(),
  CLOUDINARY_API_KEY:Joi.string().required(),
  CLOUDINARY_API_SECRET:Joi.string().required(),
  JWT_SECRET:Joi.string().required(),
});
