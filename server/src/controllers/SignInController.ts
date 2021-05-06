import Router from 'koa-router';

import { authenticateFacebook } from '../authenticators/FacebookAuthenticator';
import { authenticateGoogle } from '../authenticators/GoogleAuthenticator';
import { JwtCookieService } from '../services/JwtCookieService';
import { UserService } from '../services/UserService';
import { AuthProvider, User } from '.prisma/client';

const routes: Array<[string, AuthProvider, (request_body: any) => Promise<Pick<User, 'email' | 'name' | 'auth_id'> & { exp: number } | null>]> = [
  ['/facebook', AuthProvider.Facebook,  ({ access_token }) => authenticateFacebook(access_token)],
  ['/google',   AuthProvider.Google,    ({ id_token }) => authenticateGoogle(id_token)],
];

export default { router: routes.reduce(
  (router, [path, auth_provider, authenticator]) => router.post(path, async ctx => {
    const user_info = await authenticator(ctx.request.body);
    if (user_info) {
      const { email, name, auth_id, exp } = user_info;
      
      const now = Math.floor(Date.now() / 1000);
      if (exp > now) {
        try {
          await UserService.upsertUser(email, name, auth_provider, auth_id);
          JwtCookieService.sign(ctx.cookies, auth_provider, auth_id, 1000 * (Math.min(now + 60 * 60 * 24 * 7, exp) - now));
          ctx.response.status = 204;
          console.log(`${auth_provider} User Signed In`, auth_id);
          return;
        } catch (e) { console.error(e); }
      }
    }
    ctx.response.status = 400;
  }),
  new Router(),
)};
