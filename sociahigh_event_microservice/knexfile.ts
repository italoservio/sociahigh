import type {Knex} from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    version: process.env.DB_VERSION,
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: path.join(__dirname, 'src/database/migrations/'),
    },
  },

  production: {
    client: process.env.DB_CLIENT,
    version: process.env.DB_VERSION,
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: path.join(__dirname, 'src/database/migrations/'),
    },
  },
} as Knex.Config;
