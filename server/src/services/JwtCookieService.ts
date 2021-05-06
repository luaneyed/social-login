import Jwt from 'jsonwebtoken';
import { Context } from 'koa';

import { UserService } from './UserService';
import { AuthProvider, User } from '.prisma/client';

type Cookies = Context['cookies'];

const SECRET = '9.&*R)*sem*,>%4*4#,8%^(54s8a2h45&t854tj23!QhBSy^T)68t7Y8E%m,G153bts4e^%,.(s4d7S#48m$D%';
const COOKIE_KEY = 'SLJWT';

export class JwtCookieService {
  static sign(cookies: Cookies, auth_provider: AuthProvider, auth_id: string, expiration: number) {
    const jwt = Jwt.sign({ auth_provider, auth_id }, SECRET, { expiresIn: expiration });
    console.log('Signed JWT', jwt);
    cookies.set(COOKIE_KEY, jwt, { httpOnly: true, maxAge: expiration });  //  Important : Use secure and TLS in production
  }

  static async verify(cookies: Cookies): Promise<User | null> {
    const jwt = cookies.get(COOKIE_KEY);
    if (!jwt) {
      console.log('JWT not found in Cookie');
      return null;
    }
    console.log('JWT found in Cookie', jwt);
    try {
      const { auth_provider, auth_id } = Jwt.verify(jwt, SECRET) as { auth_provider: AuthProvider, auth_id: string };
      return await UserService.authUser(auth_provider, auth_id);
    } catch (e) {
      return null;
    }
  }

  static flush(cookies: Cookies) {
    cookies.set(COOKIE_KEY);
  }
}
