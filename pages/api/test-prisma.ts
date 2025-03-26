import type { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('[TEST_PRISMA] Prisma route hit');
  try {
    // just check if Prisma can be instantiated
    await prismadb.$connect();
    res.status(200).json({ success: true, message: 'Prisma connected!' });
  } catch (error: unknown) {
    console.error('[TEST_PRISMA_ERROR]', error);

    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    } else {
      res.status(500).json({ success: false, message: 'Unknown error' });
    }
  }
}
