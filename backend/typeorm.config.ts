import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import InitSeeder from 'src/infrastructure/seeders/init.seeder';

import { config } from 'dotenv';

config();

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
} = process.env;

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DATABASE_HOST,
  port: parseInt(DATABASE_PORT, 10),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: [__dirname + '/**/infrastructure/**/*.entity{.ts,.js}'],
};

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: DATABASE_HOST,
  port: parseInt(DATABASE_PORT, 10),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: [__dirname + '/**/infrastructure/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/**/migrations/*.ts'],
  migrationsTableName: "migrations",
  seeds: [InitSeeder]
};

export const dataSource = new DataSource(options);
