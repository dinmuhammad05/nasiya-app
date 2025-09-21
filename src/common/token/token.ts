import { Injectable } from '@nestjs/common';
import { config } from 'src/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { IToken } from '../interface/token.interface';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async accessToken(payload: IToken): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: config.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: config.ACCESS_TOKEN_TIME,
    });
  }

  async refreshToken(payload: IToken): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: config.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: config.REFRESH_TOKEN_TIME,
    });
  }

  async writeCookie(
    res: Response,
    key: string,
    value: string,
    time: number,
  ): Promise<void> {
    res.cookie(key, value, {
      httpOnly: true,
      secure: true,
      maxAge: Number(time) * 60 * 60 * 1000,
    });
  }

  async verifyToken(token: string, secretKey: string): Promise<object> {
    return this.jwt.verifyAsync(token, { secret: secretKey });
  }
}
