import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from 'src/guards/auth.guard';

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

  @Get('signout')
  @UseGuards(AuthGuard)
  async signOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.signout(req, res);
  }
}
