import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Users } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const users: Users[] = [];
    const mockAuthRepo = {
      findOneBy: ({ email }) => {
        const filteredUser = users.map((user) => {
          if (user.email === email) {
            return user;
          }
        });
        if (filteredUser.length === 0) {
          return Promise.resolve(null);
        }
        return Promise.resolve(filteredUser[0]);
      },
      create: ({ email, password }) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as Users;
        users.push(user);
        return Promise.resolve(user);
      },
      save: (user: Partial<Users>) => {
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Users), useValue: mockAuthRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a hashed password', async () => {
    const email = 'test@gmail.com';
    const password = 'secret';

    const user = await service.signup(email, password);

    expect(user).toBeDefined();
    expect(user.password).not.toEqual(password);
  });

  it('throws an error if user signs up with email that is in use', async () => {
    const email = 'test@gmail.com';
    const password = 'secret';
    await service.signup(email, password);

    await expect(service.signup(email, password)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if user try to sigin with an unused email', async () => {
    const res = '';
    const email = 'test@gmail.com';
    const password = 'secret';
    await expect(service.signin(email, password, res as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    const res = '';
    const email = 'test@gmail.com';
    const password = 'secret';
    await service.signup(email, password);
    await expect(
      service.signin(email, 'laksdlfkj', res as any),
    ).rejects.toThrow(BadRequestException);
  });
});
