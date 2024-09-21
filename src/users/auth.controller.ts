import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body.email, body.password);
    return user;
  }

  @Post('signin')
  async signIn(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signin(body.email, body.password, res);
    return user;
  }

  @Delete('signout')
  @UseGuards(AuthGuard)
  async signOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.signout(req, res);
  }
}
