import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export const getSessionUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { user: null, userId: null };
    }

    return {
      user: session.user,
      userId: session.user.id,
    };
  } catch (error) {
    console.error(error);
    return { user: null, userId: null };
  }
};
