import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Users } from '../users/users.entity';
import { cookieResponse } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: Partial<Users>;
    }
  }
}

@Injectable()
export class AuthenticateUser implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { refreshToken, accessToken } = req.signedCookies;
    try {
      if (accessToken) {
        const payload = jwt.verify(
          accessToken,
          this.configService.get('JWT_SECRET'),
        );
        const {
          user: { id: userId },
        } = payload as { user: { id: number } };
        const { id, email, role } = await this.usersService.findOne(userId);
        req.user = { id, email, role };
        return next();
      }
      const payload = jwt.verify(
        refreshToken,
        this.configService.get('JWT_SECRET'),
      );
      const {
        user: { id: userId },
      } = payload as { user: { id: number } };
      const {
        id,
        email,
        role,
        refreshToken: existingToken,
      } = await this.usersService.findOne(userId);

      if (!existingToken) {
        throw new UnauthorizedException('Authentication Invalid');
      }
      cookieResponse({
        res,
        user: { id },
        refreshToken: existingToken,
      });
      req.user = { id, email, role };
      return next();
    } catch (err) {
      return next();
    }
  }
}
