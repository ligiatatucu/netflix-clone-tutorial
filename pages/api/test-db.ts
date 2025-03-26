import type { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await prismadb.user.findMany();
    res.status(200).json({ success: true, users });
  } catch (error: any) {
    console.error('[TEST_DB_ERROR]', error);

    res.status(500).json({
      success: false,
      message: error?.message || 'Unknown error',
      name: error?.name || 'UnknownError',
      stack: error?.stack || 'No stack trace',
    });
  }
}
