import { IsString } from 'class-validator';

export class updateUserPasswordDto {
  @IsString()
  currPassword: string;
  @IsString()
  newPassword: string;
}
