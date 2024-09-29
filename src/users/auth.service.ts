import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import sendVerificationEmail from '../utils/sendVerificationEmail';
import { Repository } from 'typeorm';
import { cookieResponse } from '../utils/jwt';
import { Users } from './users.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Users) private repo: Repository<Users>) {}

  async signup(email: string, password: string) {
    const isExist = await this.repo.findOneBy({ email });
    if (isExist) {
      throw new BadRequestException('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const verificationToken = crypto.randomBytes(40).toString('hex');
    password = await bcrypt.hash(password, salt);

    const user = this.repo.create({ email, password, verificationToken });

    const origin = 'https://use-guitar-nest.vercel.app/';

    await sendVerificationEmail({
      email: user.email,
      verificationToken: user.verificationToken,
      origin,
    });

    await this.repo.save(user);
    return;
  }

  async signin(email: string, password: string, res: Response) {
    const user = await this.repo.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    if (!user.isActive) {
      throw new BadRequestException(
        'Your account is not active, please check your email for more details',
      );
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

    res.cookie('accessToken', 'logout', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(Date.now()),
    });

    return res.send();
  }
}
