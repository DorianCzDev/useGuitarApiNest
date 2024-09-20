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
  @IsEnum([
    'electric guitar',
    'classical guitar',
    'bass guitar',
    'acoustic guitar',
    'electric guitar amp',
    'bass guitar amp',
    'acoustic guitar amp',
    'bass guitar pickup',
    'electric guitar pickup',
    'guitar multi effect',
    'bass multi effect',
  ])
  subcategory: string;

  @IsString()
  @IsOptional()
  body: string;

  @IsString()
  @IsOptional()
  neck: string;

  @IsNumber()
  @Min(1)
  @Max(100000000)
  regular_price: number;

  @IsNumber()
  @Min(0)
  @Max(99)
  discount: number;
}
