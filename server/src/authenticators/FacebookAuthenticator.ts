import got from 'got';
import { User } from '.prisma/client';

export const FACEBOOK_APP_ID = process.env.SOCIAL_LOGIN_FACEBOOK_APP_ID;
if (!FACEBOOK_APP_ID) throw new Error ('You must specify environment variable SOCIAL_LOGIN_FACEBOOK_APP_ID! See README.md');

const SECRET = process.env.SOCIAL_LOGIN_FACEBOOK_APP_SECRET;
if (!SECRET) throw new Error ('You must specify environment variable SOCIAL_LOGIN_FACEBOOK_APP_SECRET! See README.md');

const graph_client = got.extend({ prefixUrl: 'https://graph.facebook.com/', responseType: 'json' });

export const authenticateFacebook = async (access_token: string): Promise<Pick<User, 'email' | 'name' | 'auth_id'> & { exp: number } | null> => {
  const { body: { data: { app_id, is_valid, data_access_expires_at, user_id } } } = await graph_client.get<{
    data: {
      app_id: string,
      type: string, //  'USER'
      application: string,
      data_access_expires_at: number, //  1618151356
      expires_at: number, //  1610350800
      is_valid: boolean,
      scopes: string[], //  [ 'email', 'public_profile' ]
      user_id: string,  //  '8963293855833324'
    }
  }>('debug_token', {
    searchParams: {
      input_token: access_token,
      access_token: `${FACEBOOK_APP_ID}|${SECRET}`
    },
  });
  if ((app_id !== FACEBOOK_APP_ID) || !is_valid || (data_access_expires_at < Date.now() / 1000)) {
    return null;
  }

  const { body: { name, email, id } } = await graph_client.get<{ name: string, email: string, id: string }>(user_id, { searchParams: { fields: 'name,email', access_token } });
  if (id !== user_id) {
    return null;
  }
  return { email, name, auth_id: id, exp: data_access_expires_at };
}
