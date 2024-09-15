import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @MaxLength(10000)
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
