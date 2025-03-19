import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prismadb from '@/lib/prismadb';

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthorized: Not signed in' });
    }

    const currentUser = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return { currentUser };
  } catch (error) {
    console.error('serverAuth error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default serverAuth;
