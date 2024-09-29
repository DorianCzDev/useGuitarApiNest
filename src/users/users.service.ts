import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Request } from 'express';
import { Repository } from 'typeorm';
import sendResetPasswordEmail from '../utils/sendResetPasswordEmail';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private repo: Repository<Users>) {}

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async updatePassword(
    currPassword: string,
    newPassword: string,
    req: Request,
  ) {
    const {
      user: { id },
    } = req;
    const user = await this.repo.findOneBy({ id });

    const isPasswordCorrect = await bcrypt.compare(currPassword, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid password');
    }

    const salt = await bcrypt.genSalt(10);

    newPassword = await bcrypt.hash(newPassword, salt);

    user.password = newPassword;
    return this.repo.save(user);
  }

  async forgotPassword(email: string) {
    if (!email) {
      throw new BadRequestException('Please provide email');
    }

    const user = await this.repo.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('No user found');
    }

    const forgotPasswordToken = crypto.randomBytes(40).toString('hex');

    const origin = 'https://use-guitar-nest.vercel.app/';

    await sendResetPasswordEmail({
      email: user.email,
      forgotPasswordToken,
      origin,
    });

    const expiresIn = 1000 * 60 * 15; // 15 min
    const forgotPasswordTokenExpirationDate = new Date(Date.now() + expiresIn);

    user.forgotPasswordToken = crypto
      .createHash('md5')
      .update(forgotPasswordToken)
      .digest('hex');

    user.forgotPasswordTokenExpirationDate = forgotPasswordTokenExpirationDate;

    return this.repo.save(user);
  }

  async restPassword(
    forgotPasswordToken: string,
    email: string,
    password: string,
  ) {
    if (!forgotPasswordToken || !email || !password) {
      throw new BadRequestException('Please provide all required values');
    }
    const user = await this.repo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const currentDate = new Date();

    if (
      user.forgotPasswordToken ===
        crypto.createHash('md5').update(forgotPasswordToken).digest('hex') &&
      user.forgotPasswordTokenExpirationDate > currentDate
    ) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      user.password = password;
      user.forgotPasswordToken = null;
      user.forgotPasswordTokenExpirationDate = null;
      return this.repo.save(user);
    }
    throw new BadRequestException(
      'Your forgot password token has expired. Please try again',
    );
  }

  async getCurrentUser(req: Request) {
    if (!req?.user?.id) {
      throw new BadRequestException('Please log in');
    }
    const user = await this.repo.findOneBy({ id: req.user.id });
    if (!user) {
      throw new BadRequestException('Please log in');
    }
    if (!user.role || user.role !== 'admin') {
      throw new UnauthorizedException('Invalid Crudentials');
    }

    return user;
  }

  async update(body: UpdateUserDto, req: Request) {
    const {
      user: { id },
    } = req;
    const user = await this.repo.findOneBy({ id });

    Object.assign(user, body);

    return this.repo.save(user);
  }

  async verifyEmail(email: string, verificationToken: string) {
    const user = await this.repo.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Verification failed');
    }

    if (user.verificationToken !== verificationToken) {
      throw new UnauthorizedException('Verification failed');
    }

    user.isActive = true;
    user.verificationToken = null;
    return this.repo.save(user);
  }
}
