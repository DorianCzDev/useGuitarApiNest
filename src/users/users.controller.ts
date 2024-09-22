import {
  Body,
  Controller,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { updateUserPasswordDto } from './dto/update-user-password.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('update-password')
  @UseGuards(AuthGuard)
  updateUserPassword(@Body() body: updateUserPasswordDto, @Req() req: Request) {
    return this.usersService.updatePassword(
      body.currPassword,
      body.newPassword,
      req,
    );
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateUser(@Body() body: UpdateUserDto, @Req() req: Request) {
    return this.usersService.update(body, req);
  }

  @Post('forgot-password')
  forgotUserPassword(@Body() body: { email: string }) {
    return this.usersService.forgotPassword(body.email);
  }

  @Patch('reset-password')
  resetUserPassword(
    @Query('email') email: string,
    @Query('forgot-password-token') forgotPasswordToken: string,
    @Body() body: { password: string },
  ) {
    return this.usersService.restPassword(
      forgotPasswordToken,
      email,
      body.password,
    );
  }
}
