import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { Product } from 'src/products/product.entity';
import { ConfigService } from '@nestjs/config';
// import connectionSource from './ormconfig';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        try {
          const dataSource = new DataSource({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'devuseguitar',
            password: config.get<string>('DB_PASSWORD'),
            username: config.get<string>('DB_USERNAME'),
            entities: [Product],
            synchronize: false,
          });
          await dataSource.initialize();
          console.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          console.log('Error connecting to database');
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
