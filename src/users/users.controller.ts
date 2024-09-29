import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { updateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('users')
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

  @Post('verify-email')
  verifyUserEmail(@Body() body: { email: string; verificationToken: string }) {
    return this.usersService.verifyEmail(body.email, body.verificationToken);
  }

  @Get('whoami')
  getCurrentUser(@Req() req: Request) {
    return this.usersService.getCurrentUser(req);
  }

  @Patch('reset-password')
  resetUserPassword(
    @Body()
    body: {
      password: string;
      forgotPasswordToken: string;
      email: string;
    },
  ) {
    return this.usersService.restPassword(
      body.forgotPasswordToken,
      body.email,
      body.password,
    );
  }
}
