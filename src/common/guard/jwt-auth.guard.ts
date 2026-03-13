import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { IS_OPTIONAL_AUTH_KEY } from '../decorator/optional-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const isOptionalAuth = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isOptionalAuth) {
      // Only attempt JWT validation if a token is actually present.
      // If there is no Authorization header, skip passport entirely so the
      // request proceeds with req.user = undefined (avoids Swagger hang).
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return true;
      }
      return super.canActivate(context) as Promise<boolean>;
    }

    return super.canActivate(context);
  }

  // For optional auth routes, suppress passport errors (no token / invalid token)
  handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    context: ExecutionContext,
  ): TUser {
    const isOptionalAuth = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isOptionalAuth) {
      // Don't throw — just return null user if unauthenticated
      return (user || null) as TUser;
    }
    if (err || !user) {
      throw err;
    }
    return user as TUser;
  }
}
