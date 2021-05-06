import { FC, useEffect, useState } from 'react';
import { Redirect } from 'react-router';

import { request } from '../utils';

export const HomeComponent: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([] as any[]);

  useEffect(() => {
    (async () => {
      try {
        const result = await request.get('/user');
        setUsers(result.data);
      } catch (e) {
        if (e.response.status === 401) {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await request.post('/sign-out');
    setIsAuthenticated(false);
  }

  if (isLoading) return null;

  return isAuthenticated
  ? <>
    <div style={{ width: "max-content", border: "2px solid", padding: 5 }} onClick={() => logout()}>Sign Out</div>
    <table style={{ width: 800 }}>
      <thead><tr>{['Email', 'Name', 'Auth Provider', 'Created At'].map((h, i) => <th key={i} style={{ textAlign: "left" }}>{h}</th>)}</tr></thead>
      <tbody>{users.map((u, i) => <tr key={i}>{[u.email, u.name, u.auth_provider, u.created_at].map((d, i) => <td key={i}>{d}</td>)}</tr>)}</tbody>
    </table>
  </>
  : <Redirect to={{ pathname: '/sign-in' }} />
};
