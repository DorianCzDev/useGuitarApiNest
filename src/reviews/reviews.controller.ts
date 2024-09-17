import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post(':productId')
  @UseGuards(AuthGuard)
  createReview(
    @Param('productId') productId: string,
    @Body() body: CreateReviewDto,
    @Req() req: Request,
  ) {
    return this.reviewsService.create(productId, body, req);
  }

  @Get(':productId')
  getReviews(
    @Param('productId') productId: string,
    @Query('rating') rating: string,
  ) {
    return this.reviewsService.get(productId, rating);
  }
}
