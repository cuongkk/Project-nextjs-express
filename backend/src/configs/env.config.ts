import Joi from "joi";

export type EnvConfig = {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  DATABASE: string;
  CLIENT_URL: string;
  JWT_SECRET?: string;
  JWT_ACCESS_SECRET?: string;
  JWT_REFRESH_SECRET: string;
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  GMAIL_USER: string;
  GMAIL_PASS: string;
};

const envSchema = Joi.object<EnvConfig>({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().integer().min(1).max(65535).default(5000),
  DATABASE: Joi.string().uri().required(),
  CLIENT_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().optional(),
  JWT_ACCESS_SECRET: Joi.string().optional(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  CLOUDINARY_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  GMAIL_USER: Joi.string().required(),
  GMAIL_PASS: Joi.string().required(),
})
  .custom((value: EnvConfig, helpers) => {
    if (!value.JWT_ACCESS_SECRET && !value.JWT_SECRET) {
      return helpers.error("any.invalid", {
        message: "Either JWT_ACCESS_SECRET or JWT_SECRET must be provided",
      });
    }

    return value;
  })
  .unknown(true);

export const validateAndLoadEnv = (): EnvConfig => {
  const { value, error } = envSchema.validate(process.env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    const details = error.details.map((detail) => detail.message).join("; ");
    throw new Error(`Invalid environment variables: ${details}`);
  }

  return value as EnvConfig;
};
