import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth: string = req.headers.authorization;

    if (!auth) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const [bearer, token] = auth.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      const data = await this.jwt.verifyAsync(token, {
        secret: config.ACCESS_TOKEN_SECRET_KEY,
      });

      if (!data?.isActive) {
        throw new ForbiddenException('User is not active');
      }

      req.user = data;
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        `Token expired or incorrect: ${error.message}`,
      );
    }
  }
}
