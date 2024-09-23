import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'test@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'secret' })
      .expect(201)
      .then((res) => {
        const { email } = res.body;
        expect(email).toEqual(email);
      });
  });
});
