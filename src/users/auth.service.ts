import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { cookieResponse } from '../utils/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Users) private repo: Repository<Users>) {}

  async signup(email: string, password: string) {
    const isExist = await this.repo.findOneBy({ email });
    if (isExist) {
      throw new BadRequestException('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);

    password = await bcrypt.hash(password, salt);

    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async signin(email: string, password: string, res: Response) {
    const user = await this.repo.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      throw new BadRequestException('Invalid email or password');
    }

    const { id } = user;

    let refreshToken: string;
    const existingToken = user.refreshToken;
    const tokenUser = { id };
    if (existingToken) {
      refreshToken = existingToken;
      cookieResponse({ res, user: tokenUser, refreshToken });
      return user;
    }

    refreshToken = crypto.randomBytes(40).toString('hex');

    user.refreshToken = refreshToken;
    cookieResponse({ res, user: tokenUser, refreshToken });

    return this.repo.save(user);
  }

  async signout(req: Request, res: Response) {
    const { id } = req.user;

    const user = await this.repo.findOneBy({ id });

    user.refreshToken = null;

    await this.repo.save(user);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    return res.send();
  }
}
