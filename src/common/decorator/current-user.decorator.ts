import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../model/entity/user.entity';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
