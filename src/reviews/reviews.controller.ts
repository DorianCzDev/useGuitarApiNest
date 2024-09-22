import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
import { AdminGuard } from '../guards/admin.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  @UseGuards(AdminGuard)
  getReportedReviews(@Query('page') page: string) {
    return this.reviewsService.getReported(parseInt(page));
  }

  @Post(':productId')
  @UseGuards(AuthGuard)
  createReview(
    @Param('productId') productId: string,
    @Body() body: CreateReviewDto,
    @Req() req: Request,
  ) {
    return this.reviewsService.create(parseInt(productId), body, req);
  }

  @Get(':productId')
  getReviews(
    @Param('productId') productId: string,
    @Query('rating') rating: string,
  ) {
    return this.reviewsService.get(productId, rating);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteReview(@Param('id') id: string) {
    return this.reviewsService.remove(parseInt(id));
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  deleteReviewFromReported(@Param('id') id: string) {
    return this.reviewsService.removeFromReported(parseInt(id));
  }
}
