import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  email: string;
  @Expose()
  role: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  postCode: string;
  @Expose()
  address: string;
  @Expose()
  city: string;
  @Expose()
  country: string;
  @Expose()
  phoneNumber: string;
}
