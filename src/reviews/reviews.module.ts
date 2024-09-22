import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from './reviews.entity';
import { Products } from '../products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reviews, Products])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
