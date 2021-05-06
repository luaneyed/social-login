import { Context } from 'koa';

import { JwtCookieService } from '../services/JwtCookieService';

export const checkAuth = async (ctx: Context, next: any) => {
  if (await JwtCookieService.verify(ctx.cookies)) {
    await next();
  } else {
    ctx.response.status = 401;
  }
}
