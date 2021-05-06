import { OAuth2Client } from 'google-auth-library';

import { User } from '.prisma/client';

export const GOOGLE_CLIENT_ID = process.env.SOCIAL_LOGIN_GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) throw new Error ('You must specify environment variable SOCIAL_LOGIN_GOOGLE_CLIENT_ID! See README.md');

const oauth_client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const authenticateGoogle = async (id_token: string): Promise<Pick<User, 'email' | 'name' | 'auth_id'> & { exp: number } | null> => {
  const login_ticket = await oauth_client.verifyIdToken({
    idToken: id_token,
    audience: GOOGLE_CLIENT_ID,
  });
  
  const payload = login_ticket.getPayload();

  return payload ? { email: payload.email!, name: payload.name!, auth_id: payload.sub, exp: payload.exp } : null;
}
