import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @MaxLength(10000, { message: 'Review cannot be longer than 1000 characters' })
  comment: string;

  @IsNumber()
  @Min(1, { message: 'Raiting must be between 1 and 5' })
  @Max(5, { message: 'Raiting must be between 1 and 5' })
  rating: number;
}
