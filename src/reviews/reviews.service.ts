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
import { Products } from 'src/products/products.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews) private repo: Repository<Reviews>,
    @InjectRepository(Products) private productsRepo: Repository<Products>,
  ) {}

  async create(productId: number, reviewDto: CreateReviewDto, req: Request) {
    const review = this.repo.create(reviewDto);
    const product = await this.productsRepo.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException('No product with given id');
    }
    review.product = productId;
    review.user = req.user.id;
    return this.repo.save(review);
  }

  async getReported(page: number) {
    const result = this.repo
      .createQueryBuilder('reviews')
      .select('reviews.*')
      .where('is_reported = true');

    const reviewsCount = await result.getCount();

    const limit = 4;
    const skip = (page - 1) * limit;

    const reviews = await result.offset(skip).limit(limit).getRawMany();

    return { reviews, reviewsCount };
  }

  async remove(id: number) {
    const review = await this.repo.findOneBy({ id });
    if (!review) {
      throw new NotFoundException('No review found');
    }

    return this.repo.remove(review);
  }

  async removeFromReported(id: number) {
    const review = await this.repo.findOneBy({ id });
    if (!review) {
      throw new NotFoundException('No review found');
    }

    review.isReported = false;

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
