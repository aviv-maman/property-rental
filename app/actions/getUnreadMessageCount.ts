'use server';
import connectDB from '@/config/database';
import MessageModel from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

const getUnreadMessageCount = async () => {
  await connectDB();
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.user) {
    return { count: undefined, error: 'User ID is required', status: 401 };
  }
  const { userId } = sessionUser;
  const count = await MessageModel.countDocuments({
    recipient: userId,
    read: false,
  });
  return { count, error: undefined };
};

export default getUnreadMessageCount;
