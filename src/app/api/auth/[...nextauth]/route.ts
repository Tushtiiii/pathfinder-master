import NextAuth, { type NextAuthOptions, type Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise, { connectToDatabase } from '../../../../lib/mongodb';
import { User } from '../../../../lib/models';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials as { email: string; password: string };

        try {
          await connectToDatabase();
          const user = await User.findOne({ email }).exec();
          if (!user) return null;

          const crypto = await import('crypto');
          const salt = user.passwordSalt as string;
          const hash = crypto.scryptSync(password, salt, 64).toString('hex');
          if (hash !== (user.passwordHash as string)) return null;

          // Return a basic user object — NextAuth will persist via adapter
          return { id: user._id.toString(), name: user.name || '', email: user.email };
        } catch (err) {
          console.error('Authorize error', err);
          return null;
        }
      },
    }),

    // Google OAuth provider. Reads from env vars. Accepts both GOOGLE_* and AUTH_GOOGLE_* names for compatibility.
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET ?? '',
    }),
  ],

  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user && token?.sub) {
        // attach id to session.user for convenience
        (session.user as Record<string, string | undefined>).id = token.sub as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'default_secret',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
