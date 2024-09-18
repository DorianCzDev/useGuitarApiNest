import { IsNumber, IsString } from 'class-validator';

export class CreateDeliveryMethodDto {
  @IsString()
  supplier: string;

  @IsNumber()
  cost: number;

  @IsNumber()
  time: number;
}
