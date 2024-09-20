import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsEnum(['guitar', 'amp', 'pickup', 'multi effect'])
  @IsOptional()
  category: string;
  @IsNumber()
  @IsOptional()
  price: number;
}
