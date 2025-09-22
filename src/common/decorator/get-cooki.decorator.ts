import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const CookieGetter = createParamDecorator(
  (data: string, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.[data];

    if (!token) {
      throw new UnauthorizedException(`${data} cookie not found`);
    }
    return token;
  },
);
