import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './orders.entity';
import { OrderProducts } from './order-products.entity';
import { Products } from '../products/products.entity';
import { DeliveryMethods } from '../delivery-methods/delivery-methods.entity';
import { Users } from '../users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      OrderProducts,
      Products,
      DeliveryMethods,
      Users,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
