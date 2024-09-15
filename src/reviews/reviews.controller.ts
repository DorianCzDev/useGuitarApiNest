import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post(':productId')
  createReview(
    @Param('productId') productId: string,
    @Body() body: CreateReviewDto,
  ) {
    return this.reviewsService.create(productId, body);
  }

  @Get(':productId')
  getReview(
    @Param('productId') productId: string,
    @Query('rating') rating: string,
  ) {
    return this.reviewsService.get(productId, rating);
  }
}
