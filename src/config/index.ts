import dotenv from 'dotenv';
dotenv.config();

export const config = {
  API_PORT: Number(process.env.API_PORT),

  DB_URI:
    String(process.env.NODE_ENV) === 'dev'
      ? String(process.env.DB_URI_DEV)
      : String(process.env.DB_URI_PROD),

  DB_SYNC: String(process.env.NODE_ENV) === 'dev' ? true : false,

  ACCESS_TOKEN_SECRET_KEY: String(process.env.ACCESS_SECRET_KEY),
  ACCESS_TOKEN_TIME: String(process.env.ACCESS_TOKEN_TIME),
  REFRESH_TOKEN_SECRET_KEY: String(process.env.REFRESH_SECRET_KEY),
  REFRESH_TOKEN_TIME: String(process.env.REFRESH_TOKEN_TIME),

  ADMIN_USERNAME: String(process.env.SUPER_ADMIN_USERNAME),
  ADMIN_PASSWORD: String(process.env.SUPER_ADMIN_PASSWORD),

  FILE_PATH: String(process.env.FILE_PATH),
  BASE_URL: String(process.env.BASE_URL),

  MAIL_HOST: String(process.env.MAIL_HOST),
  MAIL_PORT: Number(process.env.MAIL_PORT),
  MAIL_USER: String(process.env.MAIL_USER),
  MAIL_PASS: String(process.env.MAIL_PASS),

  CACHE_TIME: 1, // IN MINUTES

  LIMIT: 5,
  LIMIT_TIME: 5, // IN MINUTES
};
