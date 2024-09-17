import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(50)
  name: string;
  @IsString()
  @IsEnum(['guitar', 'amp', 'pickup', 'multi effect'])
  category: string;

  @IsString()
  @IsOptional()
  body: string;

  @IsString()
  @IsOptional()
  neck: string;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
