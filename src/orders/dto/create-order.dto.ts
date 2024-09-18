import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  supplier: string;
  @IsNumber()
  deliveryCost: number;
  @IsNumber()
  totalPrice: number;

  @IsArray()
  clientProducts: {
    productId: number;
    quantity: number;
  }[];
}
