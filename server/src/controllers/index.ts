import Router from 'koa-router';

import { GOOGLE_CLIENT_ID } from '../authenticators/GoogleAuthenticator';
import { JwtCookieService } from '../services/JwtCookieService';
import SignInController from './SignInController';
import UserController from './UserController';
import { AuthProvider } from '.prisma/client';
import { FACEBOOK_APP_ID } from '../authenticators/FacebookAuthenticator';

type Path = string;
type Controller = { router: Router };

const routeMap: Array<[Path, Controller]> = [
  ['/sign-in', SignInController],
  ['/user', UserController],
];

export default routeMap.reduce(
  (rootRouter, [path, { router }]) => rootRouter.use(path, router.routes()),
  new Router()
  .get('/', ctx => { ctx.body = 'Social Login Server is running!\nAdministrator : Sangguk Lee <sangguk258@gmail.com>' })
  .get('/provider-client-ids', ctx => { ctx.body = { [AuthProvider.Google]: GOOGLE_CLIENT_ID, [AuthProvider.Facebook]: FACEBOOK_APP_ID } })
  .get('/verify', async ctx => { ctx.body = !!await JwtCookieService.verify(ctx.cookies); })
  .post('/sign-out', ctx => {
    JwtCookieService.flush(ctx.cookies);
    ctx.response.status = 204;
  })
);
