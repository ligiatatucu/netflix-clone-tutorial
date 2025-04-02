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

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account?.provider) return false;

      const existingUser = await prismadb.user.findUnique({
        where: { email: user.email },
        include: { accounts: true },
      });

      if (!existingUser) return true;

      const hasAccountWithProvider = existingUser.accounts.some(
        (acc) => acc.provider === account.provider
      );

      // dacă nu are cont asociat cu acest provider, încearcă să îl adaugi,
      // DAR nu bloca login-ul dacă apare o eroare
      if (!hasAccountWithProvider) {
        try {
          await prismadb.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              type: account.type,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token ?? '',
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
        } catch (err) {
          console.error('[LINK_ACCOUNT_ERROR]', err);
          // În loc de return false, doar loghează și continuă
        }
      }

      return true;
    },
  },
};

export default NextAuth(authOptions);
