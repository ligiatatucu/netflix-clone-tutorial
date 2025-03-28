import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prismadb from '@/lib/prismadb';
import { compare } from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prismadb.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.hashedPassword) {
            return null;
          }

          const isCorrectPassword = await compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isCorrectPassword) {
            return null;
          }

          return user;
        } catch (error) {
          console.error('[AUTHORIZE_ERROR]', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  debug: true,
  adapter: PrismaAdapter(prismadb),
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export separately for API usage
export default NextAuth(authOptions);
