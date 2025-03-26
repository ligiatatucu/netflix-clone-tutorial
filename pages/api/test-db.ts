import type { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await prismadb.user.findMany();
    res.status(200).json({ success: true, users });
  } catch (error: unknown) {
    console.error('[TEST_DB_ERROR]', error);

    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Unknown error occurred',
      });
    }
  }
}
