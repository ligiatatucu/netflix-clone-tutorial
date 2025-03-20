import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prismadb from '@/lib/prismadb';

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) throw new Error('Unauthorized');

    const currentUser = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) throw new Error('User not found');

    return { currentUser };
  } catch (error) {
    throw error; // ❗️Re-throw, don't respond
  }
};

export default serverAuth;
