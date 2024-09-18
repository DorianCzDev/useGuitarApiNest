import { Module } from '@nestjs/common';
import { DeliveryMethodsController } from './delivery-methods.controller';
import { DeliveryMethodsService } from './delivery-methods.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryMethods } from './delivery-methods.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryMethods])],
  controllers: [DeliveryMethodsController],
  providers: [DeliveryMethodsService],
})
export class DeliveryMethodsModule {}
