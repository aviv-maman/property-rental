import connectDB from '@/config/database';
import UserModel from '@/models/User';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful signin
    async signIn({ account, profile }) {
      // 1. Connect to database
      await connectDB();
      // 2. Check if user exists
      const userExists = await UserModel.findOne({ email: profile?.email });
      // 3. If not, then add user to database
      if (!userExists) {
        // Truncate user name if too long
        const username = profile?.name?.slice(0, 20);

        await UserModel.create({
          email: profile?.email,
          username,
          image: profile?.picture,
        });
      }
      // 4. Return true to allow sign in
      return true;
    },
    // Modifies the session object
    async session({ session, user }) {
      // 1. Get user from database
      const mongoUser = await UserModel.findOne({ email: session?.user?.email });
      // 2. Check if session.user is defined
      if (session.user && mongoUser) {
        // 3. Assign the user id to the session
        session.user.id = mongoUser._id.toString();
      }
      // 4. return session
      return session;
    },
  },
};
