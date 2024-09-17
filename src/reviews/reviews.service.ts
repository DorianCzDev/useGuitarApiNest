import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import featureToArray from 'src/utils/featureToArray';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Reviews } from './reviews.entity';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Reviews) private repo: Repository<Reviews>) {}

  create(productId: string, reviewDto: CreateReviewDto, req: Request) {
    const review = this.repo.create(reviewDto);
    review.product = parseInt(productId);
    review.user = req.user.id;
    return this.repo.save(review);
  }

  async get(productId: string, rating: string) {
    const reviews = await this.repo.findBy({ product: parseInt(productId) });
    if (!reviews.length) {
      throw new NotFoundException('No reviews found.');
    }

    const ratingsCount = [
      ['1', 0],
      ['2', 0],
      ['3', 0],
      ['4', 0],
      ['5', 0],
    ];

    const ratingsArray = featureToArray(reviews, 'rating');

    for (const ratingCount of ratingsCount) {
      for (const ratingArray of ratingsArray) {
        if (ratingCount[0] === ratingArray[0]) ratingCount[1] = ratingArray[1];
      }
    }

    if (rating) {
      let result = await this.repo.findBy({
        product: parseInt(productId),
        rating: parseInt(rating),
      });
      return result;
    }

    return reviews;
  }
}
