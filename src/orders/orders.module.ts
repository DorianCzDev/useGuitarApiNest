import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './orders.entity';
import { OrderProducts } from './order-products.entity';
import { Products } from 'src/products/products.entity';
import { DeliveryMethods } from 'src/delivery-methods/delivery-methods.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      OrderProducts,
      Products,
      DeliveryMethods,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
