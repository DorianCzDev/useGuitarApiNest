import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Reviews } from './reviews.entity';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Reviews) private repo: Repository<Reviews>) {}

  create(productId: string, reviewDto: CreateReviewDto) {
    const review = this.repo.create(reviewDto);
    review.product = parseInt(productId);

    return this.repo.save(review);
  }
}
