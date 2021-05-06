import { FC, useEffect, useState } from 'react';
import GoogleLogin, { GoogleLoginProps } from 'react-google-login';
import { Redirect } from 'react-router';
import FacebookLogin, { ReactFacebookLoginProps } from 'react-facebook-login';

import { request, SERVER_URL } from '../utils';

export const SignInComponent: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [facebookAppId, setFacebookAppId] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');

  const onGoogleLogin: GoogleLoginProps['onSuccess'] = async (d) => {
    if ('tokenId' in d) {
      await request.post('/sign-in/google', { id_token: d.tokenId });
      setIsAuthenticated(true);
    }
  }

  const onFacebookCallback: ReactFacebookLoginProps['callback'] = async (u) => {
    if ('accessToken' in u) {
      await request.post('/sign-in/facebook', { access_token: u.accessToken });
      setIsAuthenticated(true);
    }
  }

  useEffect(() => {
    (async () => {
      const [{ data: isAuthenticated }, { data: { Facebook, Google } }] = await Promise.all([
        request.get<boolean>('/verify'),
        request.get<{ Facebook: string, Google: string }>('/provider-client-ids'),
      ])
      setFacebookAppId(Facebook);
      setGoogleClientId(Google);
      setIsAuthenticated(isAuthenticated);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return null;

  return isAuthenticated
  ? <Redirect to={{ pathname: '/' }} />
  : <div style={{ display: "flex", flexDirection: "column", marginTop: 250, alignItems: "center" }}>
    <GoogleLogin
      clientId={googleClientId}
      buttonText="Sign in with Google"
      onSuccess={onGoogleLogin} />
    <div style={{ margin: 10 }}></div>
    <FacebookLogin
      appId={facebookAppId}
      redirectUri={SERVER_URL}
      fields="name,email"
      callback={onFacebookCallback} />
  </div>;
};
