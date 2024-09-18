import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { Products } from '../products/products.entity';
import { ConfigService } from '@nestjs/config';
import { Reviews } from '../reviews/reviews.entity';
import { Users } from '../users/users.entity';
import { DeliveryMethods } from '../delivery-methods/delivery-methods.entity';
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
            database: config.get<string>('DB_NAME'),
            password: config.get<string>('DB_PASSWORD'),
            username: config.get<string>('DB_USERNAME'),
            entities: [Products, Reviews, Users, DeliveryMethods],
            synchronize: true,
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
