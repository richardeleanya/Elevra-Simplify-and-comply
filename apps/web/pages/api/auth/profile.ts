import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies['access_token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const apiRes = await fetch(process.env.API_URL + '/auth/profile', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!apiRes.ok) {
    return res.status(apiRes.status).json(await apiRes.json());
  }
  res.status(200).json(await apiRes.json());
}