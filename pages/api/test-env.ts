import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log('[ENV TEST] DATABASE_URL:', dbUrl);

    if (!dbUrl) {
      throw new Error('DATABASE_URL is missing');
    }

    return res.status(200).json({ dbUrl });
  } catch (err) {
    console.error('[ENV TEST ERROR]', err);
    return res.status(500).json({ error: (err as Error).message });
  }
}
