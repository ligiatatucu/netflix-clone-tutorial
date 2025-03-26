import { PrismaClient } from '@prisma/client';

const client = globalThis.prismadb ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prismadb = client;

export default client;
