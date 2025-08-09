import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' });

  // Proxy login request to API workspace, e.g. http://api:3000/auth/login
  const apiRes = await fetch(process.env.API_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });

  if (!apiRes.ok) {
    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  }

  const { access_token, refresh_token } = await apiRes.json();

  // Set JWT cookies (HttpOnly, Secure, SameSite)
  res.setHeader('Set-Cookie', [
    cookie.serialize('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15, // 15min
    }),
    cookie.serialize('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7d
    }),
  ]);
  res.status(200).json({ success: true });
}