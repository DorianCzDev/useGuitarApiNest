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
import { AuthGuard } from 'src/guards/auth.guard';
import { updateUserPasswordDto } from './dto/update-user-password.dto';
import { UsersService } from './users.service';

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
