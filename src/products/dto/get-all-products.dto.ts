import { IsEnum, IsString } from 'class-validator';

export class GetAllProductsDto {
  @IsString()
  sort: string;
  @IsString()
  page: string;
  @IsString()
  body: string;
  @IsString()
  neck: string;
  @IsString()
  @IsEnum(['guitar', 'amp', 'pickup', 'multi effect'])
  category: string;
}
