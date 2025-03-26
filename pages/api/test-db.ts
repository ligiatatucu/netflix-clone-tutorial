import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await prismadb.user.findMany();
    res.status(200).json({ users });
  } catch (error) {
    console.error('[DB ERROR]', error);
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
  }
}
