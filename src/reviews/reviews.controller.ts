import { Body, Controller, Param, Post } from '@nestjs/common';
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
}
