import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({ path: `.env.${process.env.NODE_ENV}` });

const connectionSource: any = {};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(connectionSource, {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      entities: ['**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
    });
    break;
  case 'test':
    Object.assign(connectionSource, {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      entities: ['**/*.entity.ts'],
      synchronize: false,
    });
    break;
  case 'production':
    Object.assign(connectionSource, {
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: 12776,
      database: process.env.DB_NAME,
      entities: ['**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA,
      },
      synchronize: false,
    });
    break;
  default:
    throw new Error('Unknows environment');
}

export default new DataSource(connectionSource);
