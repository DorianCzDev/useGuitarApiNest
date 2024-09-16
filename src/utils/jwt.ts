import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

export function createJWT({ payload }: { payload: {} }) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
}

export function cookieResponse({
  res,
  user,
  refreshToken,
}: {
  res: Response;
  user: {};
  refreshToken: string;
}) {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const accessExp = 1000 * 60 * 60 * 24;
  const refreshExp = 1000 * 60 * 60 * 24 * 30;
  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + accessExp),
    sameSite: 'none',
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + refreshExp),
    sameSite: 'none',
  });
}
