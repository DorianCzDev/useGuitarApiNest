import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthenticateUser } from 'src/middlewares/authentication.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateUser)
      .forRoutes(
        'products',
        'reviews',
        'users',
        'delivery',
        'orders',
        'auth/signout',
      );
  }
}
