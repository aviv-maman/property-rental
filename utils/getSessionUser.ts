import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export const getSessionUser = async () => {
  // NOTE: Here try catch block is not good practice because at build time Next.js
  // can catch the error and know not to try and statically generate pages that
  // require a auth session.
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { user: null, userId: null };
  }
  return {
    user: session.user,
    userId: session.user.id,
  };
};
