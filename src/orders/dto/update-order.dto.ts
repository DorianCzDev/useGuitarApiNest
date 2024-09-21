import { IsEnum, IsString, MaxLength } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsEnum([
    'waiting for payment',
    'waiting for shipment',
    'send',
    'delivered',
    'canceled',
  ])
  status: string;

  @IsString()
  @MaxLength(40, { message: 'First name cannot be longer than 40 characters' })
  firstName: string;
  @IsString()
  @MaxLength(40, { message: 'Last name cannot be longer than 40 characters' })
  lastName: string;
  @IsString()
  @MaxLength(10, { message: 'Post code cannot be longer than 10 characters' })
  postCode: string;
  @IsString()
  @MaxLength(40, { message: 'Address cannot be longer than 40 characters' })
  address: string;
  @IsString()
  @MaxLength(40, { message: 'City cannot be longer than 40 characters' })
  city: string;
  @IsString()
  @MaxLength(40, { message: 'Country cannot be longer than 40 characters' })
  country: string;
  @IsString()
  @MaxLength(20, {
    message: 'Phone number cannot be longer than 20 characters',
  })
  phoneNumber: string;
}
